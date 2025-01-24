import type { Config, Guild } from "@repo/db"
import type { Client, Collection, Snowflake } from "discord.js"
import type { Types } from "mongoose"

type GuildDoc = Guild & { _id: Types.ObjectId }

export interface Streamer {
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

type StoreManager = { init(): Promise<StoreManager> }
type BaseStore = { init(_client: Client): Promise<BaseStore> }
type BaseKVStore<K, V> = Collection<K, V> & {
  init(_client: Client): Promise<BaseKVStore<K, V>>
}

type ConfigStore = BaseStore & Config
type GuildStore = BaseKVStore<Snowflake, GuildDoc>
type StreamersStore = BaseKVStore<string, Streamer>

export interface DjsClient<T extends boolean = boolean> extends Client<T> {
  stores: StoreManager & {
    config: ConfigStore
    guilds: GuildStore
    streamers: StreamersStore
  }
}
