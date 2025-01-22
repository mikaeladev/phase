import type { BotCommand } from "~/structures/BotCommand"
import type {
  APIApplicationCommandSubcommandOption,
  ChatInputCommandInteraction,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js"

export type BotCommandBody<TSubcommand extends boolean = boolean> =
  TSubcommand extends false
    ? Omit<
        RESTPostAPIChatInputApplicationCommandsJSONBody,
        "default_member_permissions" | "default_permission" | "nsfw" | "handler"
      >
    : Omit<APIApplicationCommandSubcommandOption, "required">

export interface BotCommandMetadata extends Record<string, unknown> {}

export type BotCommandExecute = (
  interaction: ChatInputCommandInteraction,
) => unknown

export type BotCommandNameResolvable =
  | string
  | BotCommand
  | ChatInputCommandInteraction

export interface BotCommandFile {
  path: string
  command: BotCommand
}
