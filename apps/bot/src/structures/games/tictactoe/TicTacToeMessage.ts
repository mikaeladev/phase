import {
  bold,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  userMention,
} from "discord.js"

import { isLength } from "~/lib/utils/guards/arrays"

import { ActionRowBuilder, MessageBuilder } from "~/structures/builders"
import { TicTacToeErrorMessages, TicTacToeMarkers } from "./shared"
import { TicTacToe } from "./TicTacToe"

import type { TicTacToeBoard, TicTacToeMarker } from "./shared"
import type { TupleOf } from "~/types/utils"
import type {
  ButtonComponent,
  ButtonInteraction,
  Interaction,
  Message,
  User,
} from "discord.js"

export class TicTacToeMessage {
  public readonly tictactoe: TicTacToe

  constructor(tictactoe: TicTacToe) {
    this.tictactoe = tictactoe
  }

  public createCustomId(index: number): string {
    const player1Id = this.tictactoe.players[0].id
    const player2Id = this.tictactoe.players[1].id
    return `games.tictactoe.${index}.${player1Id}-${player2Id}`
  }

  public createBoard(): ActionRowBuilder[] {
    const buttons = this.tictactoe.board.map((marker, index) => {
      const winningMoves = this.tictactoe.winner?.winningMoves

      const customId = this.createCustomId(index)
      const disabled = !!winningMoves || marker !== TicTacToeMarkers.Empty
      const style = winningMoves?.includes(index)
        ? ButtonStyle.Primary
        : ButtonStyle.Secondary

      return new ButtonBuilder()
        .setLabel(marker)
        .setCustomId(customId)
        .setDisabled(disabled)
        .setStyle(style)
    })

    const actionRows = Array.from({ length: 3 }).map((_, rowIndex) => {
      const actionRow = new ActionRowBuilder()
      const slicedButtons = buttons.slice(rowIndex * 3, rowIndex * 3 + 3)
      for (const button of slicedButtons) actionRow.addButton(button)
      return actionRow
    })

    return actionRows
  }

  public createMessage(): MessageBuilder {
    const message = new MessageBuilder()
      .setComponents(this.createBoard())
      .setContent(userMention(this.tictactoe.currentPlayer.id))
      .setEmbeds((embed) => {
        embed.setColor("Primary")

        const [player1, player2] = this.tictactoe.players

        const player1Text = bold(player1.user.displayName)
        const player2Text = bold(player2.user.displayName)

        embed.setTitle(`${player1Text} ⚡ ${player2Text}`)

        const draw = this.tictactoe.draw
        const winner = this.tictactoe.winner?.user.displayName
        const currentPlayer = this.tictactoe.currentPlayer.user.displayName

        let description = `It's ${bold(currentPlayer)}'s turn, make a move!`

        if (draw) description = "It's a draw!"
        if (winner) description = `${bold(winner)} has won!`

        embed.setDescription(description)

        return embed
      })

    return message
  }

  static async resolvePlayers(message: Message): Promise<TupleOf<User, 2>> {
    const firstActionRow = message.components[0]
    const firstButton = firstActionRow?.components[0]

    if (firstButton?.type !== ComponentType.Button) {
      throw new Error(TicTacToeErrorMessages.InvalidBoard, {
        cause:
          "Invalid component type: " +
          (firstButton ? ComponentType[firstButton.type] : undefined),
      })
    }

    const customId = firstButton.customId

    if (!customId) {
      throw new Error(TicTacToeErrorMessages.InvalidBoard, {
        cause: "Missing button custom ID",
      })
    }

    const { player1Id, player2Id } = this.parseCustomId(customId)

    const safeFetchUser = async (id: string) => {
      const userManager = message.client.users
      const cachedUser = userManager.cache.get(id)

      if (cachedUser) return cachedUser
      return await userManager.fetch(id).catch(() => null)
    }

    const [player1, player2] = await Promise.all([
      safeFetchUser(player1Id),
      safeFetchUser(player2Id),
    ])

    if (!player1 || !player2) {
      throw new Error(TicTacToeErrorMessages.InvalidBoard, {
        cause: "Invalid player ID: " + (!player1 ? player1Id : player2Id),
      })
    }

    return [player1, player2]
  }

  static resolveBoard(message: Message): TicTacToeBoard {
    const buttons: ButtonComponent[] = []

    for (const actionRow of message.components) {
      for (const button of actionRow.components) {
        if (button.type !== ComponentType.Button) {
          const componentType = button ? ComponentType[button.type] : undefined
          throw new Error(TicTacToeErrorMessages.InvalidBoard, {
            cause: "Invalid component type: " + componentType,
          })
        }

        buttons.push(button)
      }
    }

    if (!isLength(buttons, 9)) {
      throw new Error(TicTacToeErrorMessages.InvalidBoard, {
        cause: "Board must have 9 tiles, supplied board has " + buttons.length,
      })
    }

    const board: TicTacToeMarker[] = buttons.map((button) => {
      const marker = button.label

      if (!TicTacToe.isMarker(marker)) {
        throw new Error(TicTacToeErrorMessages.InvalidBoard, {
          cause: "Invalid marker: " + marker,
        })
      }

      return marker
    })

    // this should never happen, but typescript doesn't know that
    if (!TicTacToe.isBoard(board)) {
      throw new Error(TicTacToeErrorMessages.InvalidBoard)
    }

    return board
  }

  static parseCustomId(customId: string) {
    const customIdMatches = customId.match(TicTacToeMessage.customIdRegex)

    if (!customIdMatches || !isLength(customIdMatches, 4)) {
      throw new Error(TicTacToeErrorMessages.InvalidCustomID)
    }

    return {
      index: +customIdMatches[1],
      player1Id: customIdMatches[2],
      player2Id: customIdMatches[3],
    }
  }

  static isButtonInteraction(
    interaction: Interaction,
  ): interaction is ButtonInteraction {
    if (!interaction.isButton()) return false
    const customId = interaction.customId
    return this.customIdRegex.test(customId)
  }

  static customIdRegex = /^games\.tictactoe\.([0-8])\.(\d+)-(\d+)$/
}
