import { BotEventBuilder } from "@phasejs/builders"
import { userMention } from "discord.js"

import { ModuleDefinitions, ModuleId } from "@repo/utils/modules"

import { db } from "~/lib/db"
import { isSendableChannel } from "~/lib/utils/guards"

import { MessageBuilder } from "~/structures/builders/MessageBuilder"

import type { Level as LevelDoc, Levels as ModuleConfig } from "~/types/db"
import type { Message } from "discord.js"

const { variables: levelVariables } = ModuleDefinitions[ModuleId.Levels]

export default new BotEventBuilder()
  .setName("messageCreate")
  .setExecute(async (client, message) => {
    if (!message.inGuild() || message.author.bot) return

    const guildDoc = client.stores.guilds.get(message.guildId)
    const moduleConfig = guildDoc?.modules?.[ModuleId.Levels]

    if (!moduleConfig?.enabled) return

    const levelDoc = await db.levels.findOneAndUpdate(
      { guild: message.guildId, user: message.author.id },
      { $setOnInsert: { level: 0, xp: 0 } },
      { upsert: true, returnDocument: "after" },
    )

    const { newLevel, newXP, levelUp } = calculateXP(
      levelDoc.level,
      levelDoc.xp,
    )

    await levelDoc.updateOne({ level: newLevel, xp: newXP })

    if (levelUp) {
      await sendLevelUpMessage(message, moduleConfig, levelDoc)
      await applyLevelUpRoles(message, moduleConfig, newLevel)
    }
  })

function calculateXP(currentLevel: number, currentXP: number) {
  const currentTarget = 500 * (currentLevel + 1)
  const xpToAdd = Math.floor(Math.random() * 70 + 5)
  const levelUp = !(currentXP + xpToAdd < currentTarget)

  return {
    newLevel: levelUp ? currentLevel + 1 : currentLevel,
    newXP: levelUp ? 0 : currentXP + xpToAdd,
    levelUp,
  }
}

async function sendLevelUpMessage(
  message: Message<true>,
  moduleConfig: ModuleConfig,
  levelDoc: LevelDoc,
) {
  const levelUpMessage = new MessageBuilder()

  if (moduleConfig.mention) {
    levelUpMessage.setContent(userMention(message.author.id))
  }

  levelUpMessage.setEmbeds((embed) => {
    embed.setColor("Primary")
    embed.setTitle("You levelled up!")

    if (moduleConfig.message?.length) {
      embed.setDescription(
        levelVariables.parse(moduleConfig.message, message.author, levelDoc),
      )
    }

    if (moduleConfig.channel === "dm") {
      embed.setFooter({ text: `Sent from ${message.guild.name}` })
    }

    return embed
  })

  try {
    if (moduleConfig.channel === "dm") {
      await message.author.send(levelUpMessage)
    } else if (moduleConfig.channel === "reply") {
      await message.reply(levelUpMessage)
    } else {
      const channel = message.guild.channels.cache.get(moduleConfig.channel)
      if (!channel || !isSendableChannel(channel)) return
      await channel.send(levelUpMessage)
    }
  } catch (error) {
    console.error(`[Levels] Failed to send level up message:`)
    console.error(error)
  }
}

async function applyLevelUpRoles(
  message: Message<true>,
  moduleConfig: ModuleConfig,
  newLevel: number,
) {
  try {
    const rolesToAdd = moduleConfig.roles
      .filter(({ level }) => level === newLevel)
      .map(({ role }) => role)

    if (!rolesToAdd.length) return

    await Promise.all(
      rolesToAdd.map(async (roleId) => {
        const role = message.guild.roles.cache.get(roleId)
        if (!role?.editable) return
        await message.guild.members.addRole({
          user: message.author,
          role,
        })
      }),
    )
  } catch (error) {
    console.error(`[Levels] Failed to add level up roles:`)
    console.error(error)
  }
}
