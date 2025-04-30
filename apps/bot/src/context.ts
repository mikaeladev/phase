import type {
  BotClient,
  BotCommand,
  BotContextCreators,
  BotCron,
  BotEvent,
} from "@phasejs/core"

declare module "@phasejs/core" {
  interface BotCommandContext {
    phase: BotClient
    command: BotCommand
  }

  interface BotCronContext {
    phase: BotClient
    cron: BotCron
  }

  interface BotEventContext {
    phase: BotClient
    event: BotEvent
  }
}

export const contextCreators: BotContextCreators = {
  commands(params) {
    return {
      phase: params.phase,
      command: params.command,
    }
  },
  crons(params) {
    return {
      phase: params.phase,
      cron: params.cron,
    }
  },
  events(params) {
    return {
      phase: params.phase,
      event: params.event,
    }
  },
}
