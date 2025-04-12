import { BotCommandBuilder } from "@phasejs/builders"
import { EmbedBuilder } from "discord.js"

import { ms } from "@repo/utils/ms"

import { db } from "~/lib/db"
import { PhaseColour } from "~/lib/enums"

import { BotErrorMessage } from "~/structures/BotError"

export default new BotCommandBuilder()
  .setName("reminder")
  .setDescription("Creates a reminder")
  .setDMPermission(false)
  .addStringOption((option) =>
    option
      .setName("message")
      .setDescription("The content to put in the reminder")
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("delay")
      .setDescription("How long to wait before sending the reminder")
      .setRequired(true),
  )
  .setExecute(async (interaction) => {
    const message = interaction.options.getString("message", true)
    const delay = interaction.options.getString("delay", true)

    const msDelay = ms(delay)

    if (!msDelay) {
      return void interaction.reply(
        new BotErrorMessage("The time you provided is invalid.").toJSON(),
      )
    }

    await db.reminders.create({
      name: "Reminder",
      guild: interaction.guildId,
      channel: interaction.channelId,
      content: message,
      delay: msDelay,
      mention: `<@${interaction.user.id}>`,
    })

    void interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(PhaseColour.Primary)
          .setTitle("Reminder Set")
          .setDescription("You'll be pinged when the reminder is sent.")
          .setFooter({ text: `Duration: ${ms(msDelay, { long: true })}` }),
      ],
    })
  })
