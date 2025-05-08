import { Collection } from "discord.js"

import { Base } from "~/structures/abstracts/Base"

import type { BotClient } from "~/structures/BotClient"
import type { BotCron } from "~/structures/BotCron"
import type { BotCronPattern } from "~/types/crons"

export class CronManager extends Base {
  protected _crons: Collection<BotCronPattern, BotCron[]>

  constructor(phase: BotClient) {
    super(phase)

    this._crons = new Collection()
  }

  /** Adds a cron to the manager. */
  public create(cron: BotCron) {
    const cronArray = this._crons.get(cron.pattern) ?? []

    cronArray.push(cron)
    this._crons.set(cron.pattern, cronArray)

    void this.phase.emitter.emit("cronCreate", cron)
  }

  /** Removes a cron from the manager. */
  public delete(cron: BotCron) {
    const cronArray = this._crons.get(cron.pattern)
    if (!cronArray) return

    const cronIndex = cronArray.findIndex((c) => c === cron)
    if (cronIndex === -1) return

    cronArray.splice(cronIndex, 1)
    this._crons.set(cron.pattern, cronArray)

    cron.destroy()

    void this.phase.emitter.emit("cronDelete", cron)
  }

  /** Checks if a cron exists in the manager. */
  public has(cron: BotCron) {
    const cronArray = this._crons.get(cron.pattern)
    return cronArray?.includes(cron)
  }

  /** Gets a cron from the manager. */
  public get(cron: BotCron) {
    const cronArray = this._crons.get(cron.pattern)
    return cronArray?.find((c) => c === cron)
  }

  /** Destroys all crons in the manager. */
  public destroy() {
    this._crons.forEach((cronArray, cronPattern) => {
      cronArray.forEach((cron) => cron.destroy())
      this._crons.delete(cronPattern)
    })

    return this
  }
}
