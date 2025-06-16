import { tictactoeWinningMoves } from "./shared"

import type { TicTacToePlayerMarker } from "./shared"
import type { TicTacToe } from "./TicTacToe"
import type { TupleOf } from "@repo/utils/types"
import type { User } from "discord.js"

export type TicTacToePlayerWinningMoves<TWinner extends boolean = boolean> =
  TWinner extends true ? TupleOf<number, 3> : undefined

export class TicTacToePlayer<TWinner extends boolean = boolean> {
  public readonly tictactoe: TicTacToe
  public readonly marker: TicTacToePlayerMarker
  public readonly id: string

  constructor(tictactoe: TicTacToe, user: User, marker: TicTacToePlayerMarker) {
    this.tictactoe = tictactoe
    this.id = user.id
    this.marker = marker
  }

  get user() {
    return this.tictactoe.client.users.resolve(this.id)!
  }

  get winningMoves(): TicTacToePlayerWinningMoves<TWinner> {
    for (const [a, b, c] of tictactoeWinningMoves) {
      if (
        this.tictactoe.board[a] === this.marker &&
        this.tictactoe.board[b] === this.marker &&
        this.tictactoe.board[c] === this.marker
      ) {
        return [a, b, c] as TicTacToePlayerWinningMoves<TWinner>
      }
    }

    return undefined as TicTacToePlayerWinningMoves<TWinner>
  }
}
