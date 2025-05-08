import { Cron } from "croner"

import { Base } from "~/structures/abstracts/Base"

import type { BotClient } from "~/structures/BotClient"
import type { BotCronExecute, BotCronPattern } from "~/types/crons"

export interface BotCronMetadata extends Record<string, unknown> {}
export interface BotCronContext extends Record<string, unknown> {}

export interface BotCronParams {
  pattern: BotCronPattern
  metadata: BotCronMetadata
  execute: BotCronExecute
}

export class BotCron extends Base implements Readonly<BotCronParams> {
  protected _cron: Cron | undefined

  public readonly pattern
  public readonly metadata
  public readonly execute

  constructor(phase: BotClient, params: BotCronParams) {
    super(phase)

    this.pattern = params.pattern
    this.metadata = params.metadata
    this.execute = params.execute

    this._cron = new Cron(this.pattern, { paused: true }, async () => {
      try {
        if (!this.phase.isReady()) {
          throw new Error("Client is not ready.")
        }

        const ctx = await this.phase.contextCreators.crons({
          cron: this,
          phase: this.phase,
        })

        await this.execute(this.phase.client, ctx)
      } catch (error) {
        console.error(`Error occurred in '${this.pattern}' cron:`)
        console.error(error)
      }
    })

    this.phase.emitter.on("phaseReady", () => {
      if (!this._cron) return
      this._cron.resume()
    })
  }

  /** Destroys the cron job. */
  public destroy() {
    if (!this._cron) return
    this._cron?.stop()
    this._cron = undefined
  }
}
