import type { BotClient } from "@phasejs/core"
import type { BaseBotKVStore, BaseBotStore } from "@phasejs/stores"
import type { Config, Guild } from "@repo/db"
import type { Snowflake } from "discord.js"
import type { Types } from "mongoose"

type GuildDoc = Guild & { _id: Types.ObjectId }
type Streamer = {
  id: string
  username: string
  displayName: string
  avatarUrl: string
  description: string
  stream?: {
    id: string
    url: string
    title: string
    game: string
    tags: string[]
    viewerCount: number
    thumbnailUrl: string
    startedAt: Date
  }
  notifications: {
    guildId: string
    channelId: string
    mention?: string
  }[]
}

type ConfigStore = BaseBotStore & Config
type GuildStore = BaseBotKVStore<Snowflake, GuildDoc>
type StreamersStore = BaseBotKVStore<string, Streamer>

// currently unused
type InviteStore = BaseBotKVStore

export type BotClientWithStores = BotClient<true> & {
  stores: {
    config: ConfigStore
    guilds: GuildStore
    invites: InviteStore
    streamers: StreamersStore
  }
}
