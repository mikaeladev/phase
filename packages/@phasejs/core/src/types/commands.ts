import type { BotCommand, BotCommandContext } from "~/structures/BotCommand"
import type {
  RESTPostAPIChatInputApplicationCommandsJSONBody as BotCommandJSON,
  APIApplicationCommandSubcommandOption as BotSubcommandJSON,
  ChatInputCommandInteraction,
} from "discord.js"

type BotCommandBodyOmittedProperties =
  | "default_member_permissions"
  | "default_permission"
  | "nsfw"
  | "handler"
  | "required"

export type BotCommandBody<T extends boolean = boolean> = T extends true
  ? Omit<BotSubcommandJSON, BotCommandBodyOmittedProperties>
  : Omit<BotCommandJSON, BotCommandBodyOmittedProperties>

export type BotCommandNameResolvable =
  | string
  | BotCommand
  | ChatInputCommandInteraction

export type BotCommandExecute = (
  interaction: ChatInputCommandInteraction,
  context: BotCommandContext,
) => unknown
