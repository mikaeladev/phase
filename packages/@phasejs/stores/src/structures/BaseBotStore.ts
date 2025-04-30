import { Base } from "@phasejs/core"

import type { BotClient } from "@phasejs/core"

export abstract class BaseBotStore extends Base {
  protected _init = false

  constructor(phase: BotClient) {
    super(phase)
  }

  public async init() {
    if (this._init) return this

    this._init = true
    return this
  }
}
