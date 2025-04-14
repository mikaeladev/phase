import { BotSubcommandBuilder } from "@phasejs/builders"
import { inlineCode, time } from "discord.js"

import { MessageBuilder } from "~/structures/builders/MessageBuilder"

import mongoose from "mongoose"

export default new BotSubcommandBuilder()
  .setName("ping")
  .setDescription("Calculates the current bot latency.")
  .setExecute(async (interaction) => {
    const websocketPing = interaction.client.ws.ping
    const databasePing = await getDatabasePing()

    const clientReadyDate = interaction.client.readyAt

    await interaction.reply(
      new MessageBuilder().setEmbeds((embed) => {
        return embed.setColor("Primary").setTitle("Pong! 🏓").setDescription(`
            Websocket ping: ${inlineCode(websocketPing + "ms")}
            Database ping: ${inlineCode(databasePing + "ms")}
            
            Last rebooted: ${time(clientReadyDate, "R")}
          `)
      }),
    )
  })

async function getDatabasePing() {
  const startTime = Date.now()
  await mongoose.connection.db!.admin().ping()
  return Date.now() - startTime
}