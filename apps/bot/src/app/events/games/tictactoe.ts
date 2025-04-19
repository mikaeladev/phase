import { BotEventBuilder } from "@phasejs/builders"
import { bold } from "discord.js"

import {
  TicTacToe,
  TicTacToeErrorMessages,
  TicTacToeMessage,
} from "~/structures/games/tictactoe"

export default new BotEventBuilder()
  .setName("interactionCreate")
  .setExecute(async (client, interaction) => {
    if (!TicTacToeMessage.isButtonInteraction(interaction)) return

    await interaction.deferReply()

    const { index } = TicTacToeMessage.parseCustomId(interaction.customId)

    const users = await TicTacToeMessage.resolvePlayers(interaction.message)
    const board = TicTacToeMessage.resolveBoard(interaction.message)

    const tictactoe = new TicTacToe(client, users, board)

    try {
      tictactoe.makeMove(index, interaction.user.id)
    } catch (error) {
      if (!Error.isError(error)) throw error
      if (error.message !== TicTacToeErrorMessages.InvalidMove) throw error
      return void interaction.editReply(
        `${bold(error.message)}\n${String(error.cause)}`,
      )
    }

    const message = tictactoe.message.createMessage()

    await interaction.editReply(message)
    await interaction.message.delete()
  })
