import { BotCron } from "@phasejs/core"

import { CRON_BUILDER_TAG } from "~/lib/constants"

import type { BotClient, BotCronParams } from "@phasejs/core"
import type { PartialWithRequired } from "~/types/utils"

export class BotCronBuilder {
  protected [CRON_BUILDER_TAG] = true

  protected _data: PartialWithRequired<BotCronParams, "metadata">

  constructor() {
    this._data = {
      metadata: {},
    }
  }

  /** Sets the cron time to execute on. */
  public setPattern(pattern: string) {
    this._data.pattern = pattern
    return this
  }

  /** Sets the metadata attached to the cron. */
  public setMetadata(metadata: BotCronParams["metadata"]) {
    this._data.metadata = metadata
    return this
  }

  /** Sets the function to execute when the cron is triggered. */
  public setExecute(execute: BotCronParams["execute"]) {
    this._data.execute = execute
    return this
  }

  /** Builds the cron. */
  public build(phase: BotClient): BotCron {
    if (!this._data.pattern) throw new Error("Pattern not specified.")
    if (!this._data.execute) throw new Error("Execute not specified.")

    return new BotCron(phase, {
      pattern: this._data.pattern,
      metadata: this._data.metadata,
      execute: this._data.execute,
    })
  }

  /** Creates a cron builder from a built cron. */
  static from(cron: BotCron) {
    const builder = new BotCronBuilder()

    builder.setPattern(cron.pattern)
    builder.setMetadata(cron.metadata)
    builder.setExecute(cron.execute)

    return builder
  }

  /** Checks if a value is a cron builder. */
  static isBuilder(value: unknown): value is BotCronBuilder {
    return value instanceof Object && CRON_BUILDER_TAG in value
  }
}
