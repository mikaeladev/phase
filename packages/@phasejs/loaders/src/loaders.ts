import {
  BotCommandBuilder,
  BotCronBuilder,
  BotEventBuilder,
  BotSubcommandBuilder,
} from "@phasejs/builders"

import { commandPartsReplaceRegex } from "~/lib/constants"
import { loadFile } from "~/lib/utils"

import type { BotMiddleware, BotPrestart, DjsClient } from "@phasejs/core"
import type { BotCommand, BotCron, BotEvent } from "@phasejs/core/client"
import type { AppConfig } from "~/types/app"

export async function loadCommands(
  client: DjsClient,
  paths: string[],
  config: AppConfig,
): Promise<BotCommand[]> {
  const commands: BotCommand[] = []

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

    const commandParts = path.replace(commandPartsReplaceRegex, "").split("/")

    const parentName = commandParts.length > 0 ? commandParts[0] : undefined
    const groupName = commandParts.length > 2 ? commandParts[1] : undefined

    const command = BotSubcommandBuilder.isBuilder(builder)
      ? builder.build(client, { parentName, groupName })
      : builder.build(client)

    commands.push(command)
  }

  return commands
}

export async function loadCrons(
  client: DjsClient,
  paths: string[],
  config: AppConfig,
): Promise<BotCron[]> {
  const crons: BotCron[] = []

  for (const path of paths) {
    const exports = await loadFile(path, config)
    const builder = exports.default

    if (!BotCronBuilder.isBuilder(builder)) {
      console.warn(`File does not export a valid builder: ${path}`)
      continue
    }

    const cron = builder.build(client)
    crons.push(cron)
  }

  return crons
}

export async function loadEvents(
  client: DjsClient,
  paths: string[],
  config: AppConfig,
): Promise<BotEvent[]> {
  const events: BotEvent[] = []

  for (const path of paths) {
    const exports = await loadFile(path, config)
    const builder = exports.default

    if (!BotEventBuilder.isBuilder(builder)) {
      console.warn(`File does not export a valid builder: ${path}`)
      continue
    }

    const event = builder.build(client)
    events.push(event)
  }

  return events
}

export async function loadMiddleware(
  path: string,
  config: AppConfig,
): Promise<BotMiddleware> {
  try {
    const middlewareExports = await loadFile(path, config)
    return middlewareExports as BotMiddleware
  } catch (error) {
    console.error(`Failed to load middleware file:`)
    throw error
  }
}

export async function loadPrestart(
  path: string,
  config: AppConfig,
): Promise<BotPrestart> {
  try {
    const prestartExports = await loadFile(path, config)
    return prestartExports.default as BotPrestart
  } catch (error) {
    console.error(`Failed to load prestart file:`)
    throw error
  }
}
