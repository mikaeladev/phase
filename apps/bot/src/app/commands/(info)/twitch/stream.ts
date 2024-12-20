import { BotSubcommandBuilder } from "@phasejs/builders"
import { EmbedBuilder } from "discord.js"

import { twitchAPI } from "~/lib/clients/twitch"
import { PhaseColour } from "~/lib/enums"

import { BotErrorMessage } from "~/structures/BotError"

export default new BotSubcommandBuilder()
  .setName("stream")
  .setDescription("Gives you info about a Twitch stream.")
  .addStringOption((option) =>
    option
      .setName("username")
      .setDescription("The streamer's username.")
      .setRequired(true),
  )
  .setExecute(async (interaction) => {
    await interaction.deferReply()

    const username = interaction.options.getString("username", true)
    const user = await twitchAPI.users.getUserByName(username).catch(() => null)

    if (!user) {
      void interaction.editReply(
        new BotErrorMessage(
          `Could not find a streamer under the name \`${username}\`.`,
        ).toJSON(),
      )

      return
    }

    const stream = await user.getStream().catch(() => null)

    if (!stream) {
      void interaction.editReply(
        new BotErrorMessage(
          `The streamer \`${username}\` is not currently streaming.`,
        ).toJSON(),
      )

      return
    }

    void interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            iconURL: user.profilePictureUrl,
            name: user.name ?? username,
          })
          .setColor(PhaseColour.Primary)
          .setTitle(stream.title)
          .setURL(`https://twitch.tv/${user.name}`)
          .setFields([
            {
              name: "Game",
              value: stream.gameName,
              inline: true,
            },
            {
              name: "Viewers",
              value: stream.viewers.toLocaleString(),
              inline: true,
            },
            {
              name: "Started",
              value: `<t:${Math.floor(stream.startDate.getTime() / 1000)}:R>`,
              inline: true,
            },
          ])
          .setImage(stream.getThumbnailUrl(400, 225))
          .setTimestamp(stream.startDate)
          .setFooter({
            text: `Stream ID: ${stream.id}`,
          }),
      ],
    })
  })
