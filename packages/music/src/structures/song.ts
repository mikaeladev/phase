import { formatDuration } from "~/utils"

import type { Queue } from "~/structures/queue"
import type { GuildMember } from "discord.js"

export class Song {
  readonly queue: Queue
  readonly name: string
  readonly thumbnail: string
  readonly duration: number
  readonly formattedDuration: string
  readonly isLive: boolean
  readonly url: string
  readonly streamUrl: string
  readonly submittedAt: Date
  readonly submittedBy: GuildMember

  get playbackDuration() {
    const audioResource = this.queue.voice.audioResource
    const playbackDuration = audioResource?.playbackDuration ?? 0
    return playbackDuration !== 0 ? Math.floor(playbackDuration / 1000) : 0
  }

  get formattedPlaybackDuration() {
    return formatDuration(this.playbackDuration)
  }

  constructor(
    queue: Queue,
    data: {
      name: string
      thumbnail: string
      duration: number
      url: string
      streamUrl: string
      submitter: GuildMember
    },
  ) {
    this.queue = queue
    this.name = data.name
    this.thumbnail = data.thumbnail
    this.duration = data.duration
    this.formattedDuration = formatDuration(data.duration)
    this.isLive = data.duration === 0
    this.url = data.url
    this.streamUrl = data.streamUrl
    this.submittedAt = new Date()
    this.submittedBy = data.submitter
  }
}