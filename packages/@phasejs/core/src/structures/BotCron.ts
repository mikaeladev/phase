import { Cron } from "croner"

import { Base } from "~/structures/abstracts/Base"

import type { BotClient } from "~/structures/BotClient"
import type { BotCronExecute, BotCronPattern } from "~/types/crons"

export interface BotCronMetadata extends Record<string, unknown> {}
export interface BotCronContext extends Record<string, unknown> {}

export class BotCron extends Base {
  protected _init = false
  protected _cron: Cron | undefined

  public readonly pattern: BotCronPattern
  public readonly metadata: BotCronMetadata
  public readonly execute: BotCronExecute

  constructor(
    phase: BotClient,
    params: {
      pattern: BotCronPattern
      metadata: BotCronMetadata
      execute: BotCronExecute
    },
  ) {
    super(phase)

    this.pattern = params.pattern
    this.metadata = params.metadata
    this.execute = params.execute
  }

  /**
   * Initialises the cron job.
   *
   * @throws If the cron is already initialised.
   */
  public init() {
    if (this._init) {
      throw new Error("Cron has already been initialised.")
    }

    this._cron = new Cron(this.pattern, async () => {
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

    this._init = true
    return this
  }

  /**
   * Destroys the cron job.
   */
  public destroy() {
    this._cron?.stop()
    this._cron = undefined
    this._init = false
    return this
  }
}
