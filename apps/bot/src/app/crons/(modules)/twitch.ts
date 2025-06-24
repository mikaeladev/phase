import { BotCronBuilder } from "@phasejs/builders"
import { ButtonStyle } from "discord.js"

import { isSendableChannel } from "~/lib/utils/guards"

import { MessageBuilder } from "~/structures/builders"

export default new BotCronBuilder()
  .setPattern("* * * * *")
  .setExecute(async (client, ctx) => {
    // get a before snapshot of the streamers store
    const oldStreamers = new Map(ctx.phase.stores.streamers.entries())

    // refresh the streamers store
    await ctx.phase.stores.streamers.refreshStreamers()

    for (const [id, newStreamer] of ctx.phase.stores.streamers) {
      const oldStreamer = oldStreamers.get(id)

      // cross-reference the stream status with the old values
      const isLiveNow = !!newStreamer.stream
      const wasLiveBefore = !!oldStreamer?.stream

      // if the streamer is now live, send a notification
      if (!wasLiveBefore && isLiveNow) {
        const stream = newStreamer.stream!
        const baseMessage = new MessageBuilder()

        // construct the message embed
        baseMessage.setEmbeds((embed) => {
          return embed
            .setColor("Primary")
            .setAuthor({
              name: `${newStreamer.user.displayName} is now live on Twitch!`,
              iconURL: newStreamer.user.avatarUrl,
              url: stream.url,
            })
            .setTitle(stream.title)
            .setURL(stream.url)
            .setFields([
              {
                name: "Category",
                value: stream.game,
                inline: true,
              },
              {
                name: "Viewers",
                value: stream.viewerCount.toLocaleString(),
                inline: true,
              },
            ])
            .setImage(stream.thumbnailUrl)
            .setTimestamp()
        })

        // construct the message action row
        baseMessage.setComponents((actionrow) => {
          return actionrow.addButton((button) => {
            return button
              .setStyle(ButtonStyle.Link)
              .setLabel("Watch Stream")
              .setURL(stream.url)
          })
        })

        const notificationPromises = newStreamer.notifications.map(
          async (notification) => {
            const guild = client.guilds.cache.get(notification.guildId)!
            const channel = guild.channels.cache.get(notification.channelId)

            // if the channel is not sendable, skip it
            if (!channel || !isSendableChannel(channel)) return

            // only construct a new message if the mention is set
            const message = notification.mention
              ? new MessageBuilder(baseMessage).setContent(notification.mention)
              : baseMessage

            try {
              await channel.send(message)
            } catch (error) {
              const err = `Failed to send Twitch notification to channel ${channel.id} in guild ${guild.id}:`
              console.error(err)
              console.error(error)
            }
          },
        )

        await Promise.all(notificationPromises)
      }
    }
  })
