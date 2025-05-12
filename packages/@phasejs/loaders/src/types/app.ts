import type {
  BotCommandBuilder,
  BotCronBuilder,
  BotEventBuilder,
  BotSubcommandBuilder,
} from "@phasejs/builders"
import type {
  BotClientInitParams,
  BotMiddleware,
  BotPrestart,
} from "@phasejs/core"

export type AppConfig = {
  rootDir?: string
}

export type AppPaths = {
  prestart: string | undefined
  middlewares: string | undefined
  commands: string[]
  crons: string[]
  events: string[]
}

export type AppExports = {
  prestart: Record<string, BotPrestart | undefined>
  middlewares: Record<string, BotMiddleware | undefined>
  commands: Record<string, BotCommandBuilder | BotSubcommandBuilder>
  crons: Record<string, BotCronBuilder>
  events: Record<string, BotEventBuilder>
}

export type AppInitParams = BotClientInitParams
