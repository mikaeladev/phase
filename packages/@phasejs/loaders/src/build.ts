import { BotSubcommandBuilder } from "@phasejs/builders"

import { commandPartsReplaceRegex } from "~/lib/constants"

import type { BotClient, BotCommand, BotCron, BotEvent } from "@phasejs/core"
import type { AppExports, AppInitParams } from "~/types/app"

export function buildBuilders(
  phase: BotClient,
  exports: Pick<AppExports, "commands" | "crons" | "events">,
): AppInitParams {
  const { commands, crons, events } = exports

  return {
    commands: buildCommandBuilders(phase, commands),
    crons: buildCronBuilders(phase, crons),
    events: buildEventBuilders(phase, events),
  }
}

export function buildCommandBuilders(
  phase: BotClient,
  exports: AppExports["commands"],
): BotCommand[] {
  const commands: BotCommand[] = []

  for (const [path, builder] of Object.entries(exports)) {
    if (BotSubcommandBuilder.isBuilder(builder)) {
      const commandParts = path.replace(commandPartsReplaceRegex, "").split("/")

      const parentName = commandParts.length > 0 ? commandParts[0] : undefined
      const groupName = commandParts.length > 2 ? commandParts[1] : undefined

      if (parentName) builder.setParentName(parentName)
      if (groupName) builder.setGroupName(groupName)
    }

    const command = builder.build(phase)
    commands.push(command)
  }

  return commands
}

export function buildCronBuilders(
  phase: BotClient,
  exports: AppExports["crons"],
): BotCron[] {
  const crons: BotCron[] = []

  for (const builder of Object.values(exports)) {
    const cron = builder.build(phase)
    crons.push(cron)
  }

  return crons
}

export function buildEventBuilders(
  phase: BotClient,
  exports: AppExports["events"],
): BotEvent[] {
  const events: BotEvent[] = []

  for (const builder of Object.values(exports)) {
    const event = builder.build(phase)
    events.push(event)
  }

  return events
}
