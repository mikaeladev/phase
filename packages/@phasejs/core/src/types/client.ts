import type { BotClient } from "~/structures/BotClient"
import type { Client } from "discord.js"

declare module "discord.js" {
  interface Client {
    phase: BotClient
  }
}

export type DjsClient<T extends boolean = boolean> = Client<T>
