import { BotSubcommandBuilder } from "@phasejs/builders"

import { db } from "~/lib/db"

import { BotErrorMessage } from "~/structures/BotError"

export default new BotSubcommandBuilder()
  .setName("add")
  .setDescription("Grants a member dashboard access.")
  .addUserOption((option) => {
    return option
      .setName("user")
      .setDescription("The member to add.")
      .setRequired(true)
  })
  .setMetadata({ dmPermission: false })
  .setExecute(async (interaction, ctx) => {
    await interaction.deferReply({ ephemeral: true })

    if (interaction.guild?.ownerId !== interaction.user.id) {
      return void interaction.editReply(BotErrorMessage.userNotOwner())
    }

    const user = interaction.options.getUser("user", true)

    const guildDoc = ctx.phase.stores.guilds.get(interaction.guild.id)!

    if (user.bot) {
      return void interaction.editReply(
        new BotErrorMessage(`<@${user.id}> is a bot, not a regular user.`),
      )
    }

    if (guildDoc.admins.includes(user.id)) {
      return void interaction.editReply(
        new BotErrorMessage(`<@${user.id}> already has dashboard access.`),
      )
    }

    await db.guilds.updateOne(
      { id: interaction.guildId! },
      { $push: { admins: user.id } },
    )

    void interaction.editReply(
      `<@${user.id}> has been granted dashboard access.`,
    )
  })
