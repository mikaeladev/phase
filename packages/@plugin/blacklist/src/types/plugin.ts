import type { BotClient } from "@phasejs/core"
import type { Entry } from "~/structures/Entry"
import type { Snowflake } from "discord.js"

export interface BlacklistPluginOptions {
  entries?: Iterable<[Snowflake, Entry]>
  populate?: (phase: BotClient<true>) => Iterable<[Snowflake, Entry]>
}
