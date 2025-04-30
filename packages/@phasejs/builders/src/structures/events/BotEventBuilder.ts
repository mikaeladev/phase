import { BotEvent } from "@phasejs/core"

import { EVENT_BUILDER_TAG } from "~/lib/constants"

import type {
  BotClient,
  BotEventExecute,
  BotEventListenerType,
  BotEventMetadata,
  BotEventName,
} from "@phasejs/core"

export class BotEventBuilder<TName extends BotEventName = BotEventName> {
  private name: TName
  private listenerType: BotEventListenerType
  private metadata: BotEventMetadata
  private execute: BotEventExecute<TName>

  protected [EVENT_BUILDER_TAG] = true

  constructor() {
    this.name = undefined as never
    this.listenerType = "on"
    this.metadata = {}
    this.execute = () => undefined
  }

  /**
   * Sets the name of the event.
   */
  public setName<T extends BotEventName>(name: T) {
    this.name = name as unknown as TName
    return this as unknown as BotEventBuilder<T>
  }

  /**
   * Sets the listener type of the event.
   */
  public setListenerType(listenerType: BotEvent<TName>["listenerType"]) {
    this.listenerType = listenerType
    return this
  }

  /**
   * Sets the metadata for the event.
   */
  public setMetadata(metadata: BotEventMetadata) {
    this.metadata = metadata
    return this
  }

  /**
   * Sets the function to execute when the event is triggered.
   */
  public setExecute(execute: BotEventExecute<TName>) {
    this.execute = execute
    return this
  }

  /**
   * Builds the event.
   */
  public build(phase: BotClient) {
    if (!this.name) throw new Error("Name not specified.")

    return new BotEvent(phase, {
      name: this.name,
      listenerType: this.listenerType,
      metadata: this.metadata,
      execute: this.execute,
    })
  }

  /**
   * Creates an event builder from an event.
   */
  static from(event: BotEvent) {
    const builder = new BotEventBuilder()

    builder.setName(event.name)
    builder.setListenerType(event.listenerType)
    builder.setMetadata(event.metadata)
    builder.setExecute(event.execute)

    return builder
  }

  /**
   * Checks if something is an event builder.
   */
  static isBuilder(value: unknown): value is BotEventBuilder {
    return (
      typeof value === "object" && value !== null && EVENT_BUILDER_TAG in value
    )
  }
}
