import { BotEventBuilder } from "@phasejs/builders"
import { ButtonStyle, ChannelType, userMention } from "discord.js"

import { ModuleId } from "@repo/utils/modules"

import { db } from "~/lib/db"
import { Emojis } from "~/lib/emojis"

import { MessageBuilder } from "~/structures/builders/MessageBuilder"

/**
 * Creates a JTC channel when a member joins the trigger channel.
 */
export default new BotEventBuilder()
  .setName("voiceStateUpdate")
  .setExecute(async (client, oldVoice, newVoice, ctx) => {
    if (!newVoice.channel || !newVoice.member) return

    const guildDoc = ctx.phase.stores.guilds.get(oldVoice.guild.id)
    const moduleConfig = guildDoc?.modules?.[ModuleId.JoinToCreates]

    if (!moduleConfig?.enabled) return
    if (newVoice.channelId !== moduleConfig.channel) return

    const category = newVoice.guild.channels.resolve(moduleConfig.category)

    if (
      category?.type !== ChannelType.GuildCategory ||
      !category
        .permissionsFor(client.user!)
        ?.has(["ManageChannels", "MoveMembers"])
    ) {
      return
    }

    try {
      const newJTCChannel = await newVoice.guild.channels.create({
        type: ChannelType.GuildVoice,
        name: `${newVoice.member.displayName}'s vc`,
        parent: category,
      })

      await newVoice.setChannel(newJTCChannel)

      await newJTCChannel.send(
        new MessageBuilder()
          .setContent(userMention(newVoice.member.id))
          .setEmbeds((embed) => {
            return embed
              .setColor("Primary")
              .setTitle("Voice Settings")
              .setDescription(
                `
                  Use the buttons below to configure your voice channel.
  
                  ${Emojis.Edit} - Edit the channel name.
                  ${Emojis.Users} - Disconnect a member.
                  ${Emojis.LockClosed} - Toggle the channel lock.
                  ${Emojis.Muted} - Toggle the channel mute.
                  ${Emojis.Transfer} - Transfer channel ownership.
                  ${Emojis.Delete} - Delete the channel.
                `,
              )
              .setTimestamp()
          })
          .setComponents(
            (actionrow) => {
              return actionrow
                .addButton((button) => {
                  return button
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("jtc.panel.name")
                    .setEmoji(Emojis.Edit)
                })
                .addButton((button) => {
                  return button
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("jtc.panel.users")
                    .setEmoji(Emojis.Users)
                })
                .addButton((button) => {
                  return button
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("jtc.panel.lock")
                    .setEmoji(Emojis.LockClosed)
                })
            },
            (actionrow) => {
              return actionrow
                .addButton((button) => {
                  return button
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("jtc.panel.mute")
                    .setEmoji(Emojis.Muted)
                })
                .addButton((button) => {
                  return button
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("jtc.panel.transfer")
                    .setEmoji(Emojis.Transfer)
                })
                .addButton((button) => {
                  return button
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("jtc.panel.delete")
                    .setEmoji(Emojis.Delete)
                })
            },
          ),
      )

      await db.joinToCreates.create({
        guild: newVoice.guild.id,
        channel: newJTCChannel.id,
        owner: newVoice.member.id,
      })
    } catch (error) {
      if (error instanceof Error) {
        console.error(`[Join to Creates] ${error.message}`)
        console.error(error)

        if (newVoice.member.voice.channel) {
          void newVoice.member.voice.disconnect().catch(() => null)
        }
      } else {
        throw error
      }
    }
  })
