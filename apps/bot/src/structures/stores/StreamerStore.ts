import { BaseBotKVStore } from "@phasejs/stores"

import { ModuleId } from "@repo/utils/modules"

import { twitchAPI } from "~/lib/clients/twitch"

export interface TwitchUser {
  id: string
  username: string
  displayName: string
  avatarUrl: string
  description: string
}

export interface TwitchStream {
  id: string
  url: string
  title: string
  game: string
  tags: string[]
  viewerCount: number
  thumbnailUrl: string
  startedAt: Date
}

export interface StreamerNotification {
  guildId: string
  channelId: string
  mention?: string
}

export interface Streamer {
  user: TwitchUser
  stream?: TwitchStream
  get notifications(): StreamerNotification[]
}

export class StreamerStore extends BaseBotKVStore<string, Streamer> {
  private userCache!: Map<string, TwitchUser>

  public async init() {
    if (this._init) return this

    this.userCache = new Map()

    // populate the store with the streamers
    await this.refreshStreamers()

    this._init = true
    return this
  }

  public async refreshStreamers() {
    // clear the store if it has any entries
    if (this.size > 0) this.clear()

    // loop over each guild and fetch the streamers
    for (const guildDoc of this.phase.stores.guilds.values()) {
      const config = guildDoc.modules?.[ModuleId.TwitchNotifications]
      if (!config?.enabled) continue

      const streamers = config.streamers

      for (const streamer of streamers) {
        const data = await this.fetchStreamer(streamer.id)
        if (data) this.set(streamer.id, data)
        else this.delete(streamer.id)
      }
    }
  }

  private async fetchStreamer(id: string, force = false) {
    // fetch the user data
    const user = await this.fetchTwitchUser(id, force)
    if (!user) return

    // fetch the stream data
    const stream = await this.fetchTwitchStream(id)

    // compile the streamer data
    const guildStore = this.phase.stores.guilds

    const streamer: Streamer = {
      user,
      stream,
      get notifications() {
        return guildStore.reduce<StreamerNotification[]>((acc, guildDoc) => {
          const config = guildDoc.modules?.[ModuleId.TwitchNotifications]
          if (!config?.enabled) return acc

          const streamer = config.streamers.find((s) => s.id === id)
          if (!streamer) return acc

          acc.push({
            guildId: guildDoc.id,
            channelId: streamer.channel,
            mention: streamer.mention,
          })

          return acc
        }, [])
      },
    }

    return streamer
  }

  private async fetchTwitchUser(id: string, force = false) {
    // check if the user is already cached
    const cachedUser = this.userCache.get(id)
    if (cachedUser && !force) return cachedUser

    // fetch the user from the twitch api
    const user = await twitchAPI.users.getUserById(id)
    if (!user) return

    // format the user data
    const streamerUser: TwitchUser = {
      id: user.id,
      username: user.name,
      displayName: user.displayName,
      avatarUrl: user.profilePictureUrl,
      description: user.description,
    }

    // cache the user
    this.userCache.set(id, streamerUser)

    return streamerUser
  }

  private async fetchTwitchStream(id: string) {
    // fetch the stream from the twitch api
    const stream = await twitchAPI.streams.getStreamByUserId(id)
    if (!stream) return

    // format the stream data
    const streamerStream: TwitchStream = {
      id: stream.id,
      url: `https://twitch.tv/${stream.userName}`,
      title: stream.title,
      game: stream.gameName,
      tags: stream.tags,
      viewerCount: stream.viewers,
      thumbnailUrl: `${stream.getThumbnailUrl(400, 225)}?t=${Date.now()}`,
      startedAt: stream.startDate,
    }

    return streamerStream
  }
}
