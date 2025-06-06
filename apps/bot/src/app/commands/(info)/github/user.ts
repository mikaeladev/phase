import { BotSubcommandBuilder } from "@phasejs/builders"
import { EmbedBuilder } from "discord.js"

import { Octokit } from "@octokit/rest"
import dedent from "dedent"

import { PhaseColour } from "~/lib/enums"

import { BotErrorMessage } from "~/structures/BotError"

export default new BotSubcommandBuilder()
  .setName("user")
  .setDescription("Gives you info about a GitHub user.")
  .addStringOption((option) =>
    option
      .setName("username")
      .setDescription("The user or organisation's username.")
      .setRequired(true),
  )
  .setExecute(async (interaction) => {
    const octokit = new Octokit()

    const username = interaction.options.getString("username", true)

    const user = (
      await octokit.users.getByUsername({ username }).catch(() => null)
    )?.data

    if (!user) {
      void interaction.reply(
        new BotErrorMessage(
          `Could not find a user under the name \`${username}\`.`,
        ).toJSON(),
      )

      return
    }

    void interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setAuthor({
            iconURL: user.avatar_url,
            name: user.name ?? username,
          })
          .setColor(PhaseColour.Primary)
          .setDescription(
            dedent`
              ${user.bio}

              **Followers:** ${user.followers}
              **Following:** ${user.following}
              **Joined:** <t:${Math.floor(Date.parse(user.created_at) / 1000)}:R>
            `,
          )
          .setThumbnail(user.avatar_url)
          .setFooter({
            text: `ID: ${user.id}`,
          }),
      ],
    })
  })
