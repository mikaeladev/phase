import type { BotEventContext } from "~/structures/BotEvent"
import type { DjsClient } from "~/types/client"
import type { Prettify } from "~/types/utils"
import type { ClientEvents } from "discord.js"

export type BotEvents = ClientEvents
export type BotEventName = Prettify<keyof BotEvents>
export type BotEventListenerType = "on" | "once"

export type BotEventExecuteArgsMap = {
  [TName in BotEventName]: BotEvents[TName] extends []
    ? [client: DjsClient, context: BotEventContext]
    : [client: DjsClient, ...args: BotEvents[TName], context: BotEventContext]
}

export type BotEventExecuteMap = {
  [TName in BotEventName]: (...args: BotEventExecuteArgsMap[TName]) => unknown
}

export type BotEventExecute<TName extends BotEventName> = (
  ...args: BotEventExecuteArgsMap[TName]
) => unknown
