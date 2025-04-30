import { BotSubcommandBuilder } from "@phasejs/builders"

import { db } from "~/lib/db"

import { BotErrorMessage } from "~/structures/BotError"

export default new BotSubcommandBuilder()
  .setName("remove")
  .setDescription("Revokes a member's dashboard access.")
  .addUserOption((option) => {
    return option
      .setName("user")
      .setDescription("The member to remove.")
      .setRequired(true)
  })
  .setMetadata({ dmPermission: false })
  .setExecute(async (interaction, ctx) => {
    await interaction.deferReply({ ephemeral: true })

    if (interaction.guild?.ownerId !== interaction.user.id) {
      return void interaction.editReply(BotErrorMessage.userNotOwner())
    }

    const user = interaction.options.getUser("user", true)

    if (user.id === interaction.user.id) {
      return void interaction.editReply(
        new BotErrorMessage("You can't remove yourself from the dashboard."),
      )
    }

    const guildDoc = ctx.phase.stores.guilds.get(interaction.guild.id)

    if (!guildDoc?.admins.includes(user.id)) {
      return void interaction.editReply(
        new BotErrorMessage(`<@${user.id}> does not have dashboard access.`),
      )
    }

    await db.guilds.updateOne(
      { id: interaction.guildId! },
      { $pull: { admins: user.id } },
    )

    void interaction.editReply(
      `<@${user.id}> has had their dashboard access revoked.`,
    )
  })
