import { BotCommandBuilder } from "@phasejs/builders"
import { roleMention } from "discord.js"

import { BotErrorMessage } from "~/structures/BotError"
import { MessageBuilder } from "~/structures/builders"

import type { EmbedAuthorOptions } from "discord.js"

export default new BotCommandBuilder()
  .setName("announce")
  .setDescription("Sends an embedded announcement message as the bot.")
  .setDMPermission(false)
  .addStringOption((option) => {
    return option
      .setName("message")
      .setDescription("The announcement message.")
      .setMaxLength(4000)
      .setRequired(true)
  })
  .addRoleOption((option) => {
    return option
      .setName("mention")
      .setDescription("What role to ping.")
      .setRequired(false)
  })
  .setMetadata({
    dmPermission: false,
    requiredBotPermissions: ["MentionEveryone", "SendMessages"],
    requiredUserPermissions: ["MentionEveryone", "SendMessages"],
  })
  .setExecute(async (interaction, context) => {
    await interaction.deferReply({ flags: "Ephemeral" })

    if (!interaction.channel?.isSendable()) {
      return void interaction.editReply(
        new BotErrorMessage("Announcement channel must be text-based."),
      )
    }

    const announementMessage = interaction.options.getString("message", true)
    const announementMention = interaction.options.getRole("mention")

    const announementAuthor: EmbedAuthorOptions = {
      name: interaction.user.displayName,
      iconURL: interaction.user.displayAvatarURL(),
    }

    const announementContent = announementMention
      ? announementMention.name === "@everyone"
        ? "@everyone"
        : roleMention(announementMention.id)
      : undefined

    const announement = new MessageBuilder()
      .setContent(announementContent)
      .setEmbeds((embed) => {
        return embed
          .setColor("Primary")
          .setAuthor(announementAuthor)
          .setDescription(announementMessage)
          .setTimestamp()
      })

    try {
      await interaction.channel.send(announement)
      void interaction.editReply("Announcement sent.")
    } catch (error) {
      if (!Error.isError(error)) throw error

      return void interaction.editReply(
        BotErrorMessage.unknown({
          error,
          guildId: interaction.guildId!,
          channelId: interaction.channelId,
          commandName: context.phase.commands.resolveName(context.command),
        }),
      )
    }
  })
