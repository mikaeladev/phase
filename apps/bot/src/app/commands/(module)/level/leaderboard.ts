import { BotSubcommandBuilder } from "@phasejs/core/builders"

import { ModuleId } from "@repo/utils/modules"

import { db } from "~/lib/db.ts"

import { generateLeaderboardCard } from "~/images/leaderboard.tsx"
import { BotErrorMessage } from "~/structures/BotError"

export default new BotSubcommandBuilder()
  .setName("leaderboard")
  .setDescription("Generates the server level leaderboard.")
  .addIntegerOption((option) =>
    option
      .setName("rank-start")
      .setDescription("What rank to start from.")
      .setMinValue(1)
      .setRequired(true),
  )
  .addIntegerOption((option) =>
    option
      .setName("rank-count")
      .setDescription("How many ranks to include (maximum of 15 at a time).")
      .setMinValue(1)
      .setMaxValue(15)
      .setRequired(true),
  )
  .setMetadata({ dmPermission: false })
  .setExecute(async (interaction) => {
    const rankStart = interaction.options.getInteger("rank-start", true)
    const rankCount = interaction.options.getInteger("rank-count", true)
    const rankEnd = rankStart + (rankCount - 1)

    const guildDoc = interaction.client.stores.guilds.get(interaction.guildId!)

    if (!guildDoc?.modules?.[ModuleId.Levels]?.enabled) {
      return void interaction.reply(
        BotErrorMessage.moduleNotEnabled(ModuleId.Levels).toJSON(),
      )
    }

    await interaction.deferReply()

    try {
      const usersData = await db.levels
        .find({ guild: interaction.guildId })
        .sort({ level: -1, xp: -1 })
        .skip(rankStart - 1)
        .limit(rankEnd - rankStart + 1)

      if (!usersData?.length) {
        return void interaction.editReply({
          content: "No users found within the specified rank range.",
        })
      }

      const users = []

      for (let index = 0; index < usersData.length; index++) {
        const data = usersData[index]!

        try {
          const user = await interaction.client.users.fetch(data.user)

          users.push({
            id: user.id,
            username: user.username,
            global_name: user.displayName ?? user.username,
            avatar:
              user.avatarURL({
                size: 128,
                forceStatic: true,
                extension: "png",
              }) ?? `https://phasebot.xyz/discord.png`,
            level: data.level,
            xp: data.xp,
            rank: rankStart + index,
            target: 500 * (data.level + 1),
          })
        } catch {
          continue
        }
      }

      const leaderboard = await generateLeaderboardCard(users)
      const leaderboardAttachment = leaderboard.toAttachment()

      await interaction.editReply({ files: [leaderboardAttachment] })
    } catch (error) {
      console.error(error)

      void interaction.editReply(
        BotErrorMessage.unknown({
          error: error as Error,
          commandName: "level leaderboard",
          channelId: interaction.channelId,
          guildId: interaction.guildId!,
        }).toJSON(),
      )
    }
  })
