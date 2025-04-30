import { BotSubcommandBuilder } from "@phasejs/builders"
import { ChannelType } from "discord.js"

import { ms } from "@repo/utils/ms"

import { BotErrorMessage } from "~/structures/BotError"
import { MessageBuilder } from "~/structures/builders/MessageBuilder"

import type { ApplicationCommandOptionAllowedChannelTypes } from "discord.js"

const channelTypes = [
  ChannelType.GuildVoice,
  ChannelType.GuildStageVoice,
] as const satisfies ApplicationCommandOptionAllowedChannelTypes[]

export default new BotSubcommandBuilder()
  .setName("unmute")
  .setDescription("Mass unmutes members in a voice channel.")
  .addChannelOption((option) => {
    return option
      .setName("channel")
      .setDescription("The voice channel to mass unmute.")
      .addChannelTypes(channelTypes)
      .setRequired(true)
  })
  .addRoleOption((option) => {
    return option
      .setName("exclude")
      .setDescription("Which members not to unmute (defaults to none).")
      .setRequired(false)
  })
  .addStringOption((option) => {
    return option
      .setName("reason")
      .setDescription("The reason for the unmute.")
      .setRequired(false)
  })
  .setMetadata({
    dmPermission: false,
    requiredBotPermissions: ["MuteMembers"],
    requiredUserPermissions: ["MuteMembers"],
  })
  .setExecute(async (interaction) => {
    await interaction.deferReply()

    const vc = interaction.options.getChannel("channel", true, channelTypes)
    const exclude = interaction.options.getRole("exclude")
    const reason = interaction.options.getString("reason")

    // check if the voice channel is empty
    if (vc.members.size === 0) {
      return void interaction.editReply(
        new BotErrorMessage("There are no members in the voice channel."),
      )
    }

    const excludedMembers = exclude
      ? vc.members.filter((member) => member.roles.cache.has(exclude.id))
      : null

    const membersToUnmute = vc.members
      .filter((member) => !excludedMembers?.has(member.id))
      .toJSON()

    const timeAtStart = Date.now()

    const [failedUnmutes] = await Promise.all(
      membersToUnmute.flatMap(async (member) => {
        if (!member.voice.mute) return []
        try {
          await member.voice.setMute(false, reason ?? undefined)
          return []
        } catch {
          return [member.id]
        }
      }),
    )

    const timeAtEnd = Date.now()

    // error if all unmutes failed
    if (failedUnmutes?.length === membersToUnmute.length) {
      return void interaction.editReply(
        new BotErrorMessage(
          `Failed to unmute any members in <#${vc.id}>, make sure I have the correct permissions.`,
        ),
      )
    }

    const formattedTimeTaken = ms(timeAtEnd - timeAtStart, { long: true })

    return void interaction.editReply(
      new MessageBuilder().setEmbeds((embed) => {
        return embed
          .setColor("Primary")
          .setTitle("Mass Unmuted")
          .setDescription(
            `Successfully unmuted ${membersToUnmute.length - (failedUnmutes?.length ?? 0)} members in <#${vc.id}>` +
              (failedUnmutes?.length
                ? `, though ${failedUnmutes.length} unmutes failed:`
                : ""),
          )
          .addFields(
            failedUnmutes?.length
              ? [
                  {
                    name: "Failed Unmutes",
                    value: failedUnmutes.map((id) => `<@${id}>`).join(", "),
                  },
                ]
              : [],
          )
          .setFooter({ text: `Time taken: ${formattedTimeTaken}` })
      }),
    )
  })
