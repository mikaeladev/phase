import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  StringSelectMenuBuilder,
} from "discord.js"

import { createHiddenContent, parseHiddenContent } from "@repo/utils/discord"
import { ModuleId } from "@repo/utils/modules"
import { TRPCError } from "@trpc/server"

import { findPinnedMessage, sendAndPin } from "./_utils"

import type { GuildModules } from "@repo/db"
import type { NullishPartial } from "@repo/utils/types"
import type { ContextWithGuildAuth } from "~/server/context"

export async function updateModuleDependents(
  ctx: ContextWithGuildAuth,
  input: NullishPartial<GuildModules>,
) {
  const {
    [ModuleId.AutoMessages]: autoMessages,
    [ModuleId.Forms]: forms,
    [ModuleId.ReactionRoles]: reactionRoles,
    [ModuleId.SelfRoles]: selfRoles,
    [ModuleId.Tickets]: tickets,
  } = input

  if (autoMessages) await updateAutoMessages(ctx, autoMessages)
  if (forms) await updateForms(ctx, forms)
  if (reactionRoles) await updateReactionRoles(ctx, reactionRoles)
  if (selfRoles) await updateSelfRoles(ctx, selfRoles)
  if (tickets) await updateTickets(ctx, tickets)
}

async function updateAutoMessages(
  ctx: ContextWithGuildAuth,
  config: GuildModules[ModuleId.AutoMessages],
) {
  const { db, auth } = ctx
  const { guildDoc } = auth

  const docsToInsert = config.messages.map((message) => {
    return new db.reminders({
      name: message.name,
      guild: guildDoc.id,
      channel: message.channel,
      content: message.message,
      mention: message.mention,
      delay: message.interval,
      loop: true,
    })
  })

  await db.reminders.bulkWrite([
    { deleteMany: { filter: { guild: guildDoc.id, loop: true } } },
    ...docsToInsert.map((doc) => ({ insertOne: { document: doc } })),
  ])
}

async function updateForms(
  ctx: ContextWithGuildAuth,
  config: GuildModules[ModuleId.Forms],
) {
  const { auth, env } = ctx
  const { guildAPI } = auth

  for (const form of config.forms) {
    const channel = guildAPI.channels.cache.get(form.channel)

    if (!channel?.isTextBased()) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: channel ? "Channel not found" : "Channel is not text based",
      })
    }

    const existingPanel = await findPinnedMessage(
      channel,
      (message) =>
        message.author.id === env.DISCORD_ID &&
        message.components[0]?.components?.some((component) => {
          return component.customId === `form.start.${form.id}`
        }),
    )

    const formBody = {
      embeds: [
        new EmbedBuilder()
          .setTitle(form.name)
          .setColor("#f8f8f8")
          .setDescription(
            "Press the button below to start filling out the form.",
          )
          .setFooter({
            text: `${form.questions.length} questions in total.`,
          }),
      ],
      components: [
        new ActionRowBuilder<ButtonBuilder>().setComponents(
          new ButtonBuilder()
            .setLabel(form.name)
            .setStyle(ButtonStyle.Secondary)
            .setCustomId(`form.start.${form.id}`),
        ),
      ],
    }

    if (existingPanel) {
      await existingPanel.edit(formBody)
    } else {
      await sendAndPin(channel, formBody)
    }
  }
}

async function updateReactionRoles(
  ctx: ContextWithGuildAuth,
  config: GuildModules[ModuleId.ReactionRoles],
) {
  const { auth } = ctx
  const { guildAPI } = auth

  const channel = guildAPI.channels.cache.get(config.channel)

  if (!channel?.isTextBased()) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: channel ? "Channel not found" : "Channel is not text based",
    })
  }

  const message = await channel.messages
    .fetch(config.message)
    .catch((error) => {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch message",
        cause: error,
      })
    })

  // delete all reactions if there are any
  if (message.reactions.cache.size) {
    try {
      await message.reactions.removeAll()
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete all reactions",
        cause: error,
      })
    }
  }

  const reactionPromises = config.reactions.map(({ emoji }) =>
    message.react(emoji),
  )

  try {
    await Promise.all(reactionPromises)
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to react to message",
      cause: error,
    })
  }
}

async function updateSelfRoles(
  ctx: ContextWithGuildAuth,
  config: GuildModules[ModuleId.SelfRoles],
) {
  const { auth, env } = ctx
  const { guildAPI } = auth

  for (const panel of config.messages) {
    const channel = guildAPI.channels.cache.get(panel.channel)

    if (!channel?.isTextBased()) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: channel ? "Channel not found" : "Channel is not text based",
      })
    }

    const existingPanel = await findPinnedMessage(
      channel,
      (message) =>
        message.author.id === env.DISCORD_ID &&
        message.embeds[0]?.description &&
        parseHiddenContent(message.embeds[0].description) === panel.id,
    )

    const panelBody = {
      embeds: [
        new EmbedBuilder()
          .setTitle(panel.name)
          .setColor("#f8f8f8")
          .setDescription(panel.content + " " + createHiddenContent(panel.id)),
      ],
      components: (() => {
        const actionRows: ActionRowBuilder<
          ButtonBuilder | StringSelectMenuBuilder
        >[] = []

        if (panel.type === "button") {
          const actionRow = new ActionRowBuilder<ButtonBuilder>()

          const components = panel.methods.map((method) => {
            const builder = new ButtonBuilder()
              .setLabel(method.label)
              .setStyle(ButtonStyle.Secondary)
              .setCustomId(`selfroles.${panel.id}.button.${method.id}`)
            if (method.emoji) builder.setEmoji(method.emoji)
            return builder
          })

          actionRow.setComponents(components)
          actionRows.push(actionRow)
        } else if (panel.type === "dropdown") {
          const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>()

          const component = new StringSelectMenuBuilder()
            .setCustomId(`selfroles.${panel.id}.dropdown`)
            .setOptions(
              panel.methods.map((method) => ({
                label: method.label,
                value: method.id,
                emoji: method.emoji ? { name: method.emoji } : undefined,
              })),
            )

          actionRow.setComponents(component)
          actionRows.push(actionRow)
        }

        return actionRows
      })(),
    }

    if (existingPanel) {
      await existingPanel.edit(panelBody)

      if (panel.type === "reaction") {
        if (existingPanel.reactions.cache.size) {
          try {
            await existingPanel.reactions.removeAll()
          } catch (error) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to delete all reactions",
              cause: error,
            })
          }
        }

        const reactionPromises = panel.methods.map(({ emoji }) => {
          return existingPanel.react(emoji)
        })

        try {
          await Promise.all(reactionPromises)
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to react to message",
            cause: error,
          })
        }
      }
    } else {
      const message = await sendAndPin(channel, panelBody)

      if (panel.type === "reaction") {
        const reactionPromises = panel.methods.map(({ emoji }) => {
          return message.react(emoji)
        })

        try {
          await Promise.all(reactionPromises)
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to react to message",
            cause: error,
          })
        }
      }
    }
  }
}

async function updateTickets(
  ctx: ContextWithGuildAuth,
  config: GuildModules[ModuleId.Tickets],
) {
  const { auth, env } = ctx
  const { guildAPI } = auth

  const channel = guildAPI.channels.cache.get(config.channel)

  if (!channel?.isTextBased()) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: channel ? "Channel not found" : "Channel is not text based",
    })
  }

  const existingTicketPanel = await findPinnedMessage(
    channel,
    (message) =>
      message.author.id === env.DISCORD_ID &&
      message.components[0]?.components?.some((component) => {
        return component.customId?.startsWith("ticket.open.")
      }),
  )

  const panelBody = {
    embeds: [
      new EmbedBuilder()
        .setTitle("Make a ticket 🎫")
        .setColor("#f8f8f8")
        .setDescription(config.message ?? null),
    ],
    components: [
      new ActionRowBuilder<ButtonBuilder>().setComponents(
        config.tickets.map((ticket) => {
          return new ButtonBuilder()
            .setLabel(ticket.name)
            .setStyle(ButtonStyle.Secondary)
            .setCustomId(`ticket.open.${ticket.id}`)
        }),
      ),
    ],
  }

  try {
    if (existingTicketPanel) {
      await existingTicketPanel.edit(panelBody)
    } else {
      await sendAndPin(channel, panelBody)
    }
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to update ticket panel",
      cause: error,
    })
  }
}
