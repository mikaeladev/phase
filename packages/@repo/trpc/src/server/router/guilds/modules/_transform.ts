import { ModuleId } from "@repo/utils/modules"
import { TRPCError } from "@trpc/server"
import { ApiClient } from "@twurple/api"
import { AppTokenAuthProvider } from "@twurple/auth"

import type { UpdateInputSchemaType } from "./update"
import type { GuildModules } from "@repo/db"
import type { NullishPartial } from "@repo/utils/types"
import type { ContextWithGuildAuth } from "~/server/context"
import type { GuildModulesWithExtraData } from "~/types/modules"

export async function transformUpdateInput(
  ctx: ContextWithGuildAuth,
  input: UpdateInputSchemaType,
): Promise<NullishPartial<GuildModules>> {
  const { phase, env } = ctx

  const result = {
    ...input,
    [ModuleId.TwitchNotifications]: await (async () => {
      const config = input[ModuleId.TwitchNotifications]
      if (!config) return config

      const streamerPromises = config.streamers.map(
        async ({ username, ...streamer }) => {
          let streamerId: string

          const storedStreamer = phase.stores.streamers.find(
            (s) => s.username === username,
          )

          if (storedStreamer) {
            streamerId = storedStreamer.id
          } else {
            const twitchAPI = new ApiClient({
              authProvider: new AppTokenAuthProvider(
                env.TWITCH_CLIENT_ID,
                env.TWITCH_CLIENT_SECRET,
              ),
            })

            const newStreamer = await twitchAPI.users.getUserByName(username)

            if (!newStreamer) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Could not find a streamer with the username",
              })
            }

            streamerId = newStreamer.id
          }

          return {
            ...streamer,
            id: streamerId,
          }
        },
      )

      const streamers = await Promise.all(streamerPromises)

      return {
        ...config,
        streamers,
      } satisfies GuildModules[ModuleId.TwitchNotifications]
    })(),
  }

  for (const _key in result) {
    const key = _key as keyof typeof result
    if (result[key] === undefined) delete result[key]
  }

  return result
}

export function transformUpdateOutput(
  ctx: ContextWithGuildAuth,
  output: GuildModules,
): GuildModulesWithExtraData {
  const { phase } = ctx

  const result = {
    ...output,
    [ModuleId.TwitchNotifications]: (() => {
      const config = output[ModuleId.TwitchNotifications]
      if (!config) return undefined

      return {
        ...config,
        _data: {
          streamerNames: config.streamers.reduce<Record<number, string>>(
            (acc, streamer, index) => {
              const storedStreamer = phase.stores.streamers.get(streamer.id)
              return {
                ...acc,
                [index]: storedStreamer?.username ?? "unknown",
              }
            },
            {},
          ),
        },
      }
    })(),
  }

  for (const _key in result) {
    const key = _key as keyof typeof result
    if (result[key] === undefined) delete result[key]
  }

  return result
}
