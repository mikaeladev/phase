import {
  BotCommandBuilder,
  BotCronBuilder,
  BotEventBuilder,
  BotSubcommandBuilder,
} from "@phasejs/builders"

import { loadFile } from "~/lib/utils"

import type { BotMiddleware, BotPrestart } from "@phasejs/core"
import type { AppConfig, AppExports, AppPaths } from "~/types/app"

export async function getAppExports(
  paths: AppPaths,
  config: AppConfig = {},
): Promise<AppExports> {
  const [prestart, middlewares, commands, crons, events] = await Promise.all([
    possiblyLoadPrestart(paths.prestart, config),
    possiblyLoadMiddleware(paths.middlewares, config),
    loadCommandBuilders(paths.commands, config),
    loadCronBuilders(paths.crons, config),
    loadEventBuilders(paths.events, config),
  ])

  return {
    prestart,
    middlewares,
    commands,
    crons,
    events,
  }
}

async function loadPrestart(
  path: string,
  config: AppConfig,
): Promise<AppExports["prestart"]> {
  try {
    const prestartExports = await loadFile(path, config)
    return { [path]: prestartExports.default as BotPrestart }
  } catch (error) {
    console.error(`Failed to load prestart file:`)
    throw error
  }
}

async function possiblyLoadPrestart(
  path: string | undefined,
  config: AppConfig,
): Promise<AppExports["prestart"]> {
  if (!path) return {}
  return await loadPrestart(path, config)
}

async function loadMiddleware(
  path: string,
  config: AppConfig,
): Promise<AppExports["middlewares"]> {
  try {
    const middlewareExports = await loadFile(path, config)
    return { [path]: middlewareExports as BotMiddleware }
  } catch (error) {
    console.error(`Failed to load middleware file:`)
    throw error
  }
}

async function possiblyLoadMiddleware(
  path: string | undefined,
  config: AppConfig,
): Promise<AppExports["middlewares"]> {
  if (!path) return {}
  return await loadMiddleware(path, config)
}

async function loadCommandBuilders(
  paths: string[],
  config: AppConfig,
): Promise<AppExports["commands"]> {
  const commands: AppExports["commands"] = {}

  for (const path of paths) {
    const exports = await loadFile(path, config)
    const builder = exports.default

    if (
      !BotCommandBuilder.isBuilder(builder) &&
      !BotSubcommandBuilder.isBuilder(builder)
    ) {
      console.warn(`File does not export a valid builder: ${path}`)
      continue
    }

    commands[path] = builder
  }

  return commands
}

async function loadCronBuilders(
  paths: string[],
  config: AppConfig,
): Promise<AppExports["crons"]> {
  const crons: AppExports["crons"] = {}

  for (const path of paths) {
    const exports = await loadFile(path, config)
    const builder = exports.default

    if (!BotCronBuilder.isBuilder(builder)) {
      console.warn(`File does not export a valid builder: ${path}`)
      continue
    }

    crons[path] = builder
  }

  return crons
}

async function loadEventBuilders(
  paths: string[],
  config: AppConfig,
): Promise<AppExports["events"]> {
  const events: AppExports["events"] = {}

  for (const path of paths) {
    const exports = await loadFile(path, config)
    const builder = exports.default

    if (!BotEventBuilder.isBuilder(builder)) {
      console.warn(`File does not export a valid builder: ${path}`)
      continue
    }

    events[path] = builder
  }

  return events
}
