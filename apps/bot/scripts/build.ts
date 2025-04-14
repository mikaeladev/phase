import { $, build } from "bun"
import { exists, rm } from "node:fs/promises"
import { join } from "node:path"

import { resolveRootDir, scanApp } from "@phasejs/loaders"

import chalk from "chalk"

import { dependencies } from "../package.json"

async function main() {
  console.log(chalk.bold.whiteBright(`☽ Building Phase`))

  if (await exists(".phase")) {
    console.log(chalk.grey(`- Cleaning up ...`))

    void Promise.all([
      rm(".phase/src", { recursive: true, force: true }),
      rm(".phase/assets", { recursive: true, force: true }),
      rm(".phase/chunks", { recursive: true, force: true }),
      rm(".phase/app-build-manifest.json", { force: true }),
    ])
  }

  console.log(chalk.grey(`- Validating types ...`))

  await $`tsc --noEmit`

  console.log(chalk.grey(`- Linting code ...`))

  await $`eslint .`

  console.log(chalk.grey(`- Generating bundle ...`))

  const appConfig = { rootDir: "src" }
  const rootDirPath = resolveRootDir(appConfig)

  const app = await scanApp(appConfig)

  const entrypoints = Object.values(app).reduce<string[]>((acc, value) => {
    if (!value) return acc
    if (typeof value === "string") return [...acc, join(rootDirPath, value)]
    return [...acc, ...value.map((path) => join(rootDirPath, path))]
  }, [])

  const output = await build({
    target: "bun",
    outdir: ".phase",
    entrypoints: ["src/main.ts", ...entrypoints],
    sourcemap: "external",
    external: Object.keys(dependencies),
    splitting: true,
    minify: true,
    naming: {
      asset: "assets/[name]-[hash].[ext]",
      chunk: "chunks/[name]-[hash].[ext]",
      entry: "[dir]/[name].[ext]",
    },
  })

  if (!output.success) {
    throw new AggregateError(output.logs, "Build failed")
  }

  console.log(`  `)
  console.log(`${chalk.bold.greenBright(`✓`)} Build complete!`)
}

await main()
