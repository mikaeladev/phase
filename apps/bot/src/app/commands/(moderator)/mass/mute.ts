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
  .setName("mute")
  .setDescription("Mass mutes members in a voice channel.")
  .addChannelOption((option) => {
    return option
      .setName("channel")
      .setDescription("The voice channel to mass mute.")
      .addChannelTypes(channelTypes)
      .setRequired(true)
  })
  .addRoleOption((option) => {
    return option
      .setName("exclude")
      .setDescription("Which members not to mute (defaults to mods).")
      .setRequired(false)
  })
  .addStringOption((option) => {
    return option
      .setName("reason")
      .setDescription("The reason for the mute.")
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
      : vc.members.filter((member) => member.permissions.has("MuteMembers"))

    const membersToMute = vc.members
      .filter((member) => !excludedMembers.has(member.id))
      .toJSON()

    const timeAtStart = Date.now()

    const [failedMutes] = await Promise.all(
      membersToMute.flatMap(async (member) => {
        if (member.voice.serverMute) return []
        try {
          await member.voice.setMute(true, reason ?? undefined)
          return []
        } catch {
          return [member.id]
        }
      }),
    )

    const timeAtEnd = Date.now()

    // error if all mutes failed
    if (failedMutes?.length === membersToMute.length) {
      return void interaction.editReply(
        new BotErrorMessage(
          `Failed to mute any members in <#${vc.id}>, make sure I have the correct permissions.`,
        ),
      )
    }

    const formattedTimeTaken = ms(timeAtEnd - timeAtStart, { long: true })

    return void interaction.editReply(
      new MessageBuilder().setEmbeds((embed) => {
        return embed
          .setColor("Primary")
          .setTitle("Mass Muted")
          .setDescription(
            `Successfully muted ${membersToMute.length - (failedMutes?.length ?? 0)} members in <#${vc.id}>` +
              (failedMutes?.length
                ? `, though ${failedMutes.length} mutes failed:`
                : ""),
          )
          .addFields(
            failedMutes?.length
              ? [
                  {
                    name: "Failed Mutes",
                    value: failedMutes.map((id) => `<@${id}>`).join(", "),
                  },
                ]
              : [],
          )
          .setFooter({ text: `Time taken: ${formattedTimeTaken}` })
      }),
    )
  })
