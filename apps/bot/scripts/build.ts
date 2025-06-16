import { exists, readdir, rm } from "node:fs/promises"
import { join } from "node:path"

import { getAppPaths, resolveRootDir } from "@phasejs/loaders"

import chalk from "chalk"

import type { Arrayable } from "@repo/utils/types"

const BuildFlags = {
  NoCheck: "--no-check", // skip type checking
  CopyEnvs: "--copy-envs", // copy .env files into build
  ExperimentalCompile: "--experimental-compile", // compile code into binary
} as const

await (async function main() {
  const flags = parseFlags(process.argv.slice(2))

  log("start", "Building Phase")

  if (await exists(".phase")) {
    log("step", "Cleaning up")
    await cleanUpOldBuild()
  }

  if (!flags.has("NoCheck")) {
    log("step", "Validating types")
    await Bun.$`bun run check`.quiet()

    log("step", "Linting code")
    await Bun.$`bun run lint`.quiet()
  }

  if (flags.has("CopyEnvs")) {
    log("step", "Copying env files")
    await copyEnvFilesIntoBuild()
  }

  log("step", "Scanning app")
  await generateAppScanFile()

  if (flags.has("ExperimentalCompile")) {
    log("step", "Compiling code")

    const buildFlags = [
      "--compile",
      "--minify",
      "--sourcemap",
      ".phase/bot.js",
      "--outfile",
      ".phase/bot",
    ]

    // compile the bot.js file into a binary
    await Bun.$`bun build ${buildFlags.join(" ")}`.quiet()

    // delete the bot.js file
    await rm(".phase/bot.js")
  } else {
    log("step", "Bundling code")

    // dependencies that are known to cause issues
    const externalDeps: string[] = ["discord.js"]

    // overwrite the bot.js file with the bundled code
    const output = await Bun.build({
      target: "bun",
      outdir: ".phase",
      sourcemap: "external",
      entrypoints: [".phase/bot.js"],
      external: externalDeps,
      minify: true,
      naming: {
        asset: "assets/[name]-[hash].[ext]",
        entry: "[dir]/[name].[ext]",
      },
    })

    // throw an error if the build failed
    if (!output.success) {
      throw new AggregateError(output.logs, "Build failed")
    }
  }

  log("end", "Build complete!")
})()

function log(type: "start" | "step" | "end", message: string) {
  const msgChalkFn = type === "start" ? chalk.bold.whiteBright : chalk
  const iconChalk = chalk.bold[type === "end" ? "greenBright" : "whiteBright"]

  const icon = iconChalk(type === "start" ? "☽" : type === "end" ? "✓" : "-")
  const msg = msgChalkFn(type === "step" ? `${message} ...` : message)

  console.log(`${icon} ${msg}`)
}

function parseFlags(args: string[]) {
  const flags = new Map<keyof typeof BuildFlags, true>()
  const buildFlagKeys = Object.keys(BuildFlags) as (keyof typeof BuildFlags)[]

  for (const arg of args) {
    if (!arg.startsWith("--")) continue

    const flagValue = arg as (typeof BuildFlags)[keyof typeof BuildFlags]
    const flagKey = buildFlagKeys.find((key) => BuildFlags[key] === flagValue)

    if (!flagKey) {
      throw new Error(`Unknown flag: ${arg}`)
    }

    flags.set(flagKey, true)
  }

  return flags
}

async function cleanUpOldBuild() {
  const buildContents = await readdir(".phase", { withFileTypes: true })

  const rmPromises: Promise<void>[] = []

  for (const dirent of buildContents) {
    if (dirent.name === "cache") continue

    const recursive = dirent.isDirectory()
    const promise = rm(".phase/" + dirent.name, { recursive })

    rmPromises.push(promise)
  }

  await Promise.all(rmPromises)
}

async function copyEnvFilesIntoBuild() {
  const developmentEnvFile = Bun.file(".env.development")
  const localEnvFile = Bun.file(".env.local")

  const envLines: string[] = []

  if (await developmentEnvFile.exists()) {
    const content = await developmentEnvFile.text()
    const lines = content.split("\n")
    envLines.push(...lines)
  }

  if (await localEnvFile.exists()) {
    const content = await localEnvFile.text()
    const lines = content.split("\n")
    envLines.push(...lines)
  }

  const envs: Record<string, string> = {}

  for (const line of envLines) {
    const trimmedLine = line.trim()
    if (trimmedLine.startsWith("#") || trimmedLine === "") continue
    const [key, value] = trimmedLine.split("=")
    if (key === undefined || value === undefined) continue
    envs[key] = value
  }

  const stringifiedEnvs = Object.entries(envs)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n")

  await Bun.write(".phase/.env", stringifiedEnvs)
}

async function generateAppScanFile() {
  const appConfig = { rootDir: "src" }
  const rootDirPath = resolveRootDir(appConfig)
  const appPaths = await getAppPaths(appConfig)

  // app scan file imports

  const importPath = (path: string) =>
    (path.startsWith(".") ? join(rootDirPath, path) : path).replace(/\\/g, "/")

  const createImport = (name: string, path: string) =>
    `import ${name} from "${importPath(path)}"`

  const createImportBlock = (name: string, paths: string[]) =>
    paths.map((path, i) => createImport(`${name}_${i}`, path)).join("\n")

  const appScanFileImports = [
    createImport("{ getAppInitParams }", "@phasejs/loaders"),
    createImport("{ phaseClient }", "./lib/clients/phase"),
    createImportBlock("command", appPaths.commands),
    createImportBlock("cron", appPaths.crons),
    createImportBlock("event", appPaths.events),
  ]

  if (appPaths.prestart) {
    const i = createImport("prestart", appPaths.prestart)
    appScanFileImports.push(i)
  }

  if (appPaths.middlewares) {
    const i = createImport("* as middlewares", appPaths.middlewares)
    appScanFileImports.push(i)
  }

  // app scan file code

  const createRecord = (name: string, paths: Arrayable<string | undefined>) => {
    if (paths === undefined) return "{}"
    if (typeof paths === "string") return `{ ["${paths}"]: ${name} }`
    return `{ ${paths.map((path, i) => `["${path}"]: ${name}_${i}`).join()} }`
  }

  const appScanFileCode = [
    ``,
    `const initParams = getAppInitParams(phaseClient, {`,
    `  prestart: ${createRecord("prestart", appPaths.prestart)},`,
    `  middlewares: ${createRecord("middlewares", appPaths.middlewares)},`,
    `  commands: ${createRecord("command", appPaths.commands)},`,
    `  crons: ${createRecord("cron", appPaths.crons)},`,
    `  events: ${createRecord("event", appPaths.events)},`,
    `})`,
    ``,
    `await phaseClient.init(initParams)`,
  ]

  // write file

  await Bun.write(
    ".phase/bot.js",
    [...appScanFileImports, ...appScanFileCode].join("\n"),
  )
}
