import type { BotClient } from "~/structures/BotClient"

export abstract class Base {
  public readonly phase: BotClient

  constructor(phase: BotClient) {
    this.phase = phase
  }
}
