import type { BaseKVStore, BaseStore } from "@phasejs/core/stores"
import type { Config, Guild, mongoose } from "@repo/database"
import type { Snowflake } from "discord.js"

import type {} from "@phasejs/core/client"
import type {} from "@phasejs/core/managers"

type WithId<T> = T & { _id: mongoose.Types.ObjectId }

type ConfigStore = BaseStore & Config
type GuildStore = BaseKVStore<Snowflake, WithId<Guild>>
type InviteStore = BaseKVStore // not used here
type TwitchStatusStore = BaseKVStore // not used here

declare module "@phasejs/core/managers" {
  interface StoreManager {
    config: ConfigStore
    guilds: GuildStore
    invites: InviteStore
    twitchStatuses: TwitchStatusStore
  }
}

export type { DjsClient } from "@phasejs/core"
