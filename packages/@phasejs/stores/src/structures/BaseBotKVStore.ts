import { Collection } from "discord.js"

import type { Base, BotClient } from "@phasejs/core"

export abstract class BaseBotKVStore<K = string, V = unknown>
  extends Collection<K, V>
  implements Base
{
  protected _init = false

  public readonly phase: BotClient

  constructor(phase: BotClient) {
    super()
    this.phase = phase
  }

  public async init() {
    if (this._init) return this

    this._init = true
    return this
  }
}
