import { Emojis } from "~/lib/emojis"

import type { TicTacToePlayer } from "./TicTacToePlayer"
import type { TupleOf, ValueOf } from "@repo/utils/types"

// types //

export type TicTacToeBoardSize = typeof tictactoeBoardSize
export type TicTacToePlayerCount = typeof tictactoePlayerCount

export type TicTacToeMarker = ValueOf<typeof TicTacToeMarkers>
export type TicTacToePlayerMarker = Exclude<
  TicTacToeMarker,
  (typeof TicTacToeMarkers)["Empty"]
>

export type TicTacToePlayers = TupleOf<TicTacToePlayer, TicTacToePlayerCount>
export type TicTacToeBoard = TupleOf<TicTacToeMarker, TicTacToeBoardSize>

// enums //

export const TicTacToeErrorMessages = {
  InvalidMove: "TicTacToe Error: Invalid move",
  InvalidBoard: "TicTacToe Error: Invalid board",
  InvalidCustomID: "TicTacToe Error: Invalid custom ID",
}

export const TicTacToeMarkers = {
  Empty: Emojis.ZeroWidthJoiner,
  Player1: "❌",
  Player2: "⭕",
} as const

// constants //

export const tictactoeBoardSize = 9
export const tictactoePlayerCount = 2

export const tictactoeEmptyBoard = [
  TicTacToeMarkers.Empty,
  TicTacToeMarkers.Empty,
  TicTacToeMarkers.Empty,
  TicTacToeMarkers.Empty,
  TicTacToeMarkers.Empty,
  TicTacToeMarkers.Empty,
  TicTacToeMarkers.Empty,
  TicTacToeMarkers.Empty,
  TicTacToeMarkers.Empty,
] as const satisfies TupleOf<TicTacToeMarker, TicTacToeBoardSize>

export const tictactoeWinningMoves = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const satisfies TupleOf<number, 3>[]
