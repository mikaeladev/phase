import { BotEventBuilder } from "@phasejs/builders"
import { GuildMember } from "discord.js"

import { ModuleId } from "@repo/utils/modules"

import { BotErrorMessage } from "~/structures/BotError"
import { updateRoles } from "./_utils"

import type { UUID } from "node:crypto"

const methodNotFoundError = new BotErrorMessage(
  "The self role method associated with this component no longer exists.",
).toJSON()

export default new BotEventBuilder()
  .setName("interactionCreate")
  .setExecute(async (_, interaction, ctx) => {
    if (!interaction.inGuild()) return
    if (!interaction.isMessageComponent()) return
    if (!interaction.customId.startsWith("selfroles")) return

    const guildDoc = ctx.phase.stores.guilds.get(interaction.guildId)
    const moduleConfig = guildDoc?.modules?.[ModuleId.SelfRoles]

    if (!moduleConfig?.enabled) {
      return void interaction.reply(
        BotErrorMessage.moduleNotEnabled(ModuleId.SelfRoles).toJSON(),
      )
    }

    const customIdParts = interaction.customId.split(".") as
      | ["selfroles", UUID, "button", UUID]
      | ["selfroles", UUID, "dropdown"]

    const messageId = customIdParts[1]
    const message = moduleConfig.messages.find(({ id }) => id === messageId)

    if (message?.type === "button") {
      const buttonId = customIdParts[3]
      const buttonIndex = message?.methods.findIndex(
        ({ id }) => id === buttonId,
      )

      if (buttonIndex === -1) {
        return void interaction.reply(methodNotFoundError)
      }

      void interaction.deferUpdate()

      const member =
        interaction.member instanceof GuildMember
          ? interaction.member
          : await interaction.guild!.members.fetch(interaction.user.id)

      await updateRoles(member, message, buttonIndex)
    } else if (message?.type === "dropdown") {
      const optionId = customIdParts[3]
      const optionIndex = message?.methods.findIndex(
        ({ id }) => id === optionId,
      )

      if (optionIndex === -1) {
        return void interaction.reply(methodNotFoundError)
      }

      void interaction.deferUpdate()

      const member =
        interaction.member instanceof GuildMember
          ? interaction.member
          : await interaction.guild!.members.fetch(interaction.user.id)

      await updateRoles(member, message, optionIndex)
    } else {
      return void interaction.reply(methodNotFoundError)
    }
  })
