import type { BotClient } from "~/structures/BotClient"
import type { BotCommand, BotCommandContext } from "~/structures/BotCommand"
import type { BotCron, BotCronContext } from "~/structures/BotCron"
import type { BotEvent, BotEventContext } from "~/structures/BotEvent"
import type { Awaitable } from "discord.js"

export type BotCommandContextCreator = (params: {
  phase: BotClient
  command: BotCommand
}) => Awaitable<BotCommandContext>

export type BotCronContextCreator = (params: {
  phase: BotClient
  cron: BotCron
}) => Awaitable<BotCronContext>

export type BotEventContextCreator = (params: {
  phase: BotClient
  event: BotEvent
}) => Awaitable<BotEventContext>

export type BotContextCreators = {
  commands: BotCommandContextCreator
  crons: BotCronContextCreator
  events: BotEventContextCreator
}
