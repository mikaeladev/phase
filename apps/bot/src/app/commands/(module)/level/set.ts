import { BotSubcommandBuilder } from "@phasejs/builders"

import { ModuleId } from "@repo/utils/modules"

import { db } from "~/lib/db"

import { BotErrorMessage } from "~/structures/BotError"

export default new BotSubcommandBuilder()
  .setName("set")
  .setDescription("Sets a users rank data.")
  .addUserOption((option) => {
    return option
      .setName("user")
      .setDescription("Specify a user.")
      .setRequired(true)
  })
  .addIntegerOption((option) => {
    return option
      .setName("level")
      .setDescription("Set a new level rank for the user.")
      .setRequired(true)
  })
  .addIntegerOption((option) => {
    return option
      .setName("xp")
      .setDescription("Set a new xp rank for the user.")
      .setRequired(true)
  })
  .setMetadata({
    dmPermission: false,
    requiredUserPermissions: ["ManageGuild"],
  })
  .setExecute(async (interaction, ctx) => {
    const user = interaction.options.getUser("user", true)
    const level = interaction.options.getInteger("level", true)
    const xp = interaction.options.getInteger("xp", true)

    const guildDoc = ctx.phase.stores.guilds.get(interaction.guildId!)

    if (!guildDoc?.modules?.[ModuleId.Levels]?.enabled) {
      return void interaction.reply(
        BotErrorMessage.moduleNotEnabled(ModuleId.Levels).toJSON(),
      )
    }

    const levelDoc = await db.levels.findOne({
      guild: interaction.guildId!,
      user: user.id,
    })

    if (!levelDoc)
      void db.levels.create({
        guild: interaction.guildId,
        user: user.id,
        level: level,
        xp: level,
      })
    else {
      levelDoc.level = level
      levelDoc.xp = xp

      void levelDoc.save()
    }

    void interaction.reply({
      content: "Level data has been updated.",
      ephemeral: true,
    })
  })
