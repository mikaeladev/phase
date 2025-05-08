import { BotPlugin } from "@phasejs/core"

import chalk from "chalk"

import { version as pkgVersion } from "~/../package.json"

import type { BotClient, BotPluginVersion } from "@phasejs/core"

export interface LogsPluginOptions {
  name: string
  version: string
}

export function logsPlugin(options: LogsPluginOptions) {
  const wait = chalk.bold.whiteBright("-")
  const notice = chalk.bold.blueBright("!")
  const success = chalk.bold.greenBright(`✓`)

  const startupLogs = (phase: BotClient) => {
    let initTime = 0
    let readyTime = 0

    void phase.emitter.once("phaseInit").then(() => {
      initTime = Date.now()

      const environment = chalk.grey(`${process.env.NODE_ENV}`)
      const platform = chalk.grey(`${process.platform} (${process.arch})`)
      const runtime = chalk.grey(
        "Bun" in globalThis
          ? `Bun ${(globalThis as unknown as { Bun: { version: string } }).Bun.version}`
          : "Deno" in globalThis
            ? `Deno ${(globalThis as unknown as { Deno: { version: string } }).Deno.version}`
            : `Node ${process.version}`,
      )

      const header = chalk.bold.whiteBright(
        `☽ ${options.name} v${options.version}`,
      )

      console.log(header)
      console.log(`• Environment: ${environment}`)
      console.log(`• Platform: ${platform}`)
      console.log(`• Runtime: ${runtime}`)
      console.log(`  `)
      console.log(`${wait} Starting up ...`)
    })

    void phase.emitter.once("phaseReady").then(() => {
      readyTime = Date.now()

      const secondsToReady = (readyTime - initTime) / 1000
      const formattedReadyTime = chalk.grey(`(${secondsToReady.toFixed(2)}s)`)

      console.log(`${success} Ready! ${formattedReadyTime}`)
      console.log(`  `)
    })
  }

  const liveCommandLogs = (phase: BotClient) => {
    void phase.emitter.on("commandSyncCreate", ({ name }) => {
      console.log(`${notice} Created '${name}' command.`)
    })

    void phase.emitter.on("commandSyncDelete", ({ name }) => {
      console.log(`${notice} Deleted '${name}' command.`)
    })

    void phase.emitter.on("commandSyncUpdate", ({ name }) => {
      console.log(`${notice} Updated '${name}' command.`)
    })
  }

  return new BotPlugin({
    name: "Logs",
    trigger: "init",
    version: pkgVersion as BotPluginVersion,
    onLoad(phase) {
      startupLogs(phase)
      liveCommandLogs(phase)
    },
  })
}
