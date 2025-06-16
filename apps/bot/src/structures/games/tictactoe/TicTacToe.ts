import {
  tictactoeBoardSize,
  tictactoeEmptyBoard,
  TicTacToeErrorMessages,
  TicTacToeMarkers,
} from "./shared"
import { TicTacToeMessage } from "./TicTacToeMessage"
import { TicTacToePlayer } from "./TicTacToePlayer"

import type {
  TicTacToeBoard,
  TicTacToeMarker,
  TicTacToePlayerMarker,
  TicTacToePlayers,
} from "./shared"
import type { TupleOf } from "@repo/utils/types"
import type { Client, User } from "discord.js"

export class TicTacToe {
  public readonly client: Client
  public readonly board: TicTacToeBoard
  public readonly players: TicTacToePlayers
  public readonly message: TicTacToeMessage

  constructor(
    client: Client,
    users: TupleOf<User, 2>,
    board: TicTacToeBoard = tictactoeEmptyBoard,
  ) {
    this.client = client
    this.board = board
    this.message = new TicTacToeMessage(this)

    this.players = [
      new TicTacToePlayer(this, users[0], TicTacToeMarkers.Player1),
      new TicTacToePlayer(this, users[1], TicTacToeMarkers.Player2),
    ]
  }

  public get movesMade(): number {
    const emptyMarker = TicTacToeMarkers.Empty
    const nonEmptyTiles = this.board.filter((marker) => marker !== emptyMarker)
    return nonEmptyTiles.length
  }

  public get currentPlayer(): TicTacToePlayer {
    const currentPlayerIndex = (this.movesMade % 2) as 0 | 1
    return this.players[currentPlayerIndex]
  }

  public get winner(): TicTacToePlayer<true> | undefined {
    return this.players.find((player) => player.winningMoves)
  }

  public get draw(): boolean {
    return !this.winner && this.movesMade === tictactoeBoardSize
  }

  public get gameOver(): boolean {
    return this.draw || !!this.winner
  }

  public makeMove(index: number, playerId: TicTacToePlayer["id"]) {
    if (!this.getPlayerById(playerId)) {
      throw new Error(TicTacToeErrorMessages.InvalidMove, {
        cause: "You are not a player in this game.",
      })
    }

    if (playerId !== this.currentPlayer.id) {
      throw new Error(TicTacToeErrorMessages.InvalidMove, {
        cause: "It's not your turn!",
      })
    }

    if (index < 0 || index > 8) {
      throw new Error(TicTacToeErrorMessages.InvalidMove, {
        cause: "Invalid board index: " + index,
      })
    }

    if (this.gameOver) {
      throw new Error(TicTacToeErrorMessages.InvalidMove, {
        cause: "Game is over",
      })
    }

    if (this.board[index] !== TicTacToeMarkers.Empty) {
      throw new Error(TicTacToeErrorMessages.InvalidMove, {
        cause: "Board tile is already taken",
      })
    }

    this.board[index] = this.currentPlayer.marker
  }

  public getPlayerById(id: string) {
    return this.players.find((player) => player.id === id)!
  }

  public getPlayerByMarker(marker: TicTacToePlayerMarker) {
    return this.players.find((player) => player.marker === marker)!
  }

  static isMarker(this: void, marker: unknown): marker is TicTacToeMarker {
    return (
      typeof marker === "string" &&
      Object.values(TicTacToeMarkers).includes(marker)
    )
  }

  static isBoard(this: void, board: unknown): board is TicTacToeBoard {
    return (
      Array.isArray(board) &&
      board.length === 9 &&
      board.every(TicTacToe.isMarker)
    )
  }
}
