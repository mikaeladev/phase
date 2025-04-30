import type { BotCommandContext } from "~/structures/BotCommand"
import type { BotCommandExecute } from "~/types/commands"
import type { ChatInputCommandInteraction } from "discord.js"

export type BotCommandMiddleware = (
  interaction: ChatInputCommandInteraction,
  context: BotCommandContext,
  execute: BotCommandExecute,
) => unknown

export interface BotMiddleware {
  commands?: BotCommandMiddleware
}
