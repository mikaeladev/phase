import { BotCron } from "@phasejs/core/client"

import { CRON_BUILDER_TAG } from "~/lib/constants"

import type { BotCronExecute, DjsClient } from "@phasejs/core"

export class BotCronBuilder {
  private pattern: BotCron["pattern"]
  private metadata: BotCron["metadata"]
  private execute: BotCron["execute"]

  protected [CRON_BUILDER_TAG] = true

  constructor() {
    this.pattern = undefined as never
    this.metadata = { type: "cron" }
    this.execute = () => undefined
  }

  /**
   * Sets the cron time to execute on.
   */
  public setPattern(pattern: string) {
    this.pattern = pattern
    return this
  }

  /**
   * Sets the metadata for the cron job.
   */
  public setMetadata(metadata: Omit<BotCron["metadata"], "type">) {
    this.metadata = { type: "cron", ...metadata }
    return this
  }

  /**
   * Sets the function to execute when the cron job is triggered.
   */
  public setExecute(execute: BotCronExecute) {
    this.execute = execute
    return this
  }

  /**
   * Builds the cron job.
   */
  public build(client: DjsClient): BotCron {
    if (!this.pattern) throw new Error("Pattern not specified.")

    return new BotCron(client, {
      pattern: this.pattern,
      metadata: this.metadata,
      execute: this.execute,
    })
  }

  /**
   * Creates a cron job builder from a cron job.
   */
  static from(cron: BotCron) {
    const builder = new BotCronBuilder()

    builder.setPattern(cron.pattern)
    builder.setMetadata(cron.metadata)
    builder.setExecute(cron.execute)

    return builder
  }

  /**
   * Checks if something is a cron job builder.
   */
  static isBuilder(thing: unknown): thing is BotCronBuilder {
    return (
      typeof thing === "object" && thing !== null && CRON_BUILDER_TAG in thing
    )
  }
}
