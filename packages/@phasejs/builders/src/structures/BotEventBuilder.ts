import { BotEvent, BotEventListenerType } from "@phasejs/core"

import { EVENT_BUILDER_TAG } from "~/lib/constants"

import type { BotClient, BotEventName, BotEventParams } from "@phasejs/core"
import type { PartialWithRequired } from "~/types/utils"

export class BotEventBuilder<TName extends BotEventName = BotEventName> {
  protected [EVENT_BUILDER_TAG] = true

  protected _data: PartialWithRequired<
    BotEventParams<TName>,
    "metadata" | "listenerType"
  >

  constructor() {
    this._data = {
      listenerType: BotEventListenerType.ON,
      metadata: {},
    }
  }

  /** Sets the event name to listen to. */
  public setName<T extends BotEventName>(name: T) {
    this._data.name = name as unknown as TName
    return this as unknown as BotEventBuilder<T>
  }

  /** Sets the listener type of the event. */
  public setListenerType(listenerType: BotEventParams<TName>["listenerType"]) {
    this._data.listenerType = listenerType
    return this
  }

  /** Sets the metadata attached to the event. */
  public setMetadata(metadata: BotEventParams<TName>["metadata"]) {
    this._data.metadata = metadata
    return this
  }

  /** Sets the function to execute when the event is triggered. */
  public setExecute(execute: BotEventParams<TName>["execute"]) {
    this._data.execute = execute
    return this
  }

  /** Builds the event. */
  public build(phase: BotClient) {
    if (!this._data.name) throw new Error("Name not specified.")
    if (!this._data.execute) throw new Error("Execute not specified.")

    return new BotEvent(phase, {
      name: this._data.name,
      listenerType: this._data.listenerType,
      metadata: this._data.metadata,
      execute: this._data.execute,
    })
  }

  /** Creates an event builder from a built event. */
  static from(event: BotEvent) {
    const builder = new BotEventBuilder()

    builder.setName(event.name)
    builder.setListenerType(event.listenerType)
    builder.setMetadata(event.metadata)
    builder.setExecute(event.execute)

    return builder
  }

  /** Checks if a value is an event builder. */
  static isBuilder(value: unknown): value is BotEventBuilder {
    return value instanceof Object && EVENT_BUILDER_TAG in value
  }
}
