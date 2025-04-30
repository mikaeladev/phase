import { Entry, EntryType } from "@plugin/blacklist"

import type { BlacklistPluginOptions } from "@plugin/blacklist"
import type { Snowflake } from "discord.js"

export const blacklistConfig = {
  populate(phase) {
    const config = phase.stores.config.blacklist

    return [
      ...config.guilds.map((entry): [Snowflake, Entry] => [
        entry.id,
        new Entry({
          id: entry.id,
          type: EntryType.Guild,
          reason: entry.reason,
        }),
      ]),
      ...config.users.map((entry): [Snowflake, Entry] => [
        entry.id,
        new Entry({
          id: entry.id,
          type: EntryType.User,
          reason: entry.reason,
        }),
      ]),
    ]
  },
} satisfies BlacklistPluginOptions
