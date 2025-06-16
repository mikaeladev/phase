import { MessageType } from "discord.js"

import { TRPCError } from "@trpc/server"

import type {
  GuildTextBasedChannel,
  Message,
  MessageCreateOptions,
} from "discord.js"


export async function sendAndPin(
  channel: GuildTextBasedChannel,
  body: MessageCreateOptions,
) {
  const message = await channel.send(body)

  await channel.messages.pin(message)

  const possiblePinNotifications = await channel.messages.fetch({
    after: message.id,
    limit: 5, // in case messages have been sent since
  })

  const pinNotification = possiblePinNotifications.find(
    (message) => message.type === MessageType.ChannelPinnedMessage,
  )

  if (pinNotification) {
    await pinNotification.delete()
  }

  return message
}

export async function findPinnedMessage(
  channel: GuildTextBasedChannel,
  findFn: (message: Message<true>) => unknown,
) {
  const channelPins = await channel.messages
    .fetchPinned()
    .catch((err) => err as Error)

  if (Error.isError(channelPins)) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch pinned messages",
      cause: channelPins,
    })
  }

  const message = channelPins.find(findFn)
  return message
}
