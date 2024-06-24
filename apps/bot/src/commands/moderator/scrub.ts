import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js"
import { BotCommandBuilder } from "phasebot/builders"

import { errorMessage, PhaseColour, PhaseError } from "~/utils"

export default new BotCommandBuilder()
  .setName("scrub")
  .setDescription(
    "Deletes the channel and creates an exact copy with no messages.",
  )
  .setDMPermission(false)
  .addStringOption((option) =>
    option
      .setName("reason")
      .setDescription("The reason for the scrub.")
      .setRequired(false),
  )
  .setExecute(async (interaction) => {
    if (interaction.channel?.isThread()) {
      return interaction.reply(
        errorMessage({
          title: "Invalid Channel",
          description: "This command cannot be used in threads.",
        }),
      )
    }

    const warningMessage = await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("Yellow")
          .setTitle("⚠️ Warning")
          .setDescription(
            `This command will delete ${interaction.channel}, then create a new channel with the same settings. All message history will be lost forever.\n\nAny bots, webhooks, or third-party applications currently connected to ${interaction.channel} will not be transferred to the new channel. You will need to reconnect them manually.\n\nThis action is irreversible, are you absolutely sure you wish to proceed?`,
          )
          .setFooter({
            text: "Buttons will be disabled in 1 minute.",
          }),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new ButtonBuilder()
              .setCustomId(`scrub.proceed`)
              .setLabel("Scrub")
              .setStyle(ButtonStyle.Danger),
          )
          .addComponents(
            new ButtonBuilder()
              .setCustomId(`scrub.abort`)
              .setLabel("Abort")
              .setStyle(ButtonStyle.Secondary),
          ),
      ],
    })

    warningMessage
      .awaitMessageComponent({
        filter: (component) => component.customId.startsWith("scrub"),
        time: 1000 * 60,
      })
      .then(async (buttonInteraction) => {
        if (
          !interaction.channel ||
          interaction.channel.isDMBased() ||
          interaction.channel.isThread()
        ) {
          return
        }

        if (buttonInteraction.user.id !== interaction.user.id) {
          return interaction.reply(
            errorMessage({
              title: "Access Denied",
              description: PhaseError.AccessDenied,
              ephemeral: true,
            }),
          )
        }

        if (buttonInteraction.customId === "scrub.abort") {
          await buttonInteraction.deferUpdate()
          await warningMessage.delete()
        }

        if (buttonInteraction.customId === "scrub.proceed") {
          await buttonInteraction.deferUpdate()

          const channel = await interaction.channel.clone({
            reason: `@${interaction.user.username} ran /scrub`,
          })

          await channel.send({
            embeds: [
              new EmbedBuilder()
                .setColor(PhaseColour.Primary)
                .setTitle("Channel Scrubbed")
                .setDescription(
                  `This channel was scrubbed by ${interaction.user}`,
                ),
            ],
          })

          await interaction.channel!.delete(
            `@${interaction.user.username} ran /scrub`,
          )
        }
      })
  })