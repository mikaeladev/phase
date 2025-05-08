import { Collection } from "discord.js"

import { Base } from "~/structures/abstracts/Base"

import type { BotClient } from "~/structures/BotClient"
import type { BotEvent } from "~/structures/BotEvent"
import type { BotEventExecute, BotEventName } from "~/types/events"

export class EventManager extends Base {
  protected _events: Collection<BotEventName, BotEvent[]>

  constructor(phase: BotClient) {
    super(phase)

    this._events = new Collection()
  }

  /** Adds an event to the manager. */
  public create(event: BotEvent) {
    const eventArray = this._events.get(event.name) ?? []

    eventArray.push(event)
    this._events.set(event.name, eventArray)

    void this.phase.emitter.emit("eventCreate", event)
  }

  /** Removes an event from the manager. */
  public delete<T extends BotEventName>(name: T, execute?: BotEventExecute<T>) {
    const eventArray = this._events.get(name)
    if (!eventArray) return

    if (execute) {
      const eventIndex = eventArray.findIndex((e) => e.execute === execute)
      if (eventIndex === -1) return

      const event = eventArray[eventIndex]!

      eventArray.splice(eventIndex, 1)
      this._events.set(name, eventArray)

      event.destroy()

      return void this.phase.emitter.emit("eventDelete", event)
    }

    this._events.delete(name)

    for (const event of eventArray) {
      event.destroy()

      void this.phase.emitter.emit("eventDelete", event)
    }
  }

  /** Checks if an event exists in the manager. */
  public has<T extends BotEventName>(name: T, execute?: BotEventExecute<T>) {
    const eventArray = this._events.get(name)
    return eventArray?.some((event) => {
      return execute ? event.execute === execute : event.name === name
    })
  }

  /** Gets an event from the manager. */
  public get(event: BotEvent) {
    const eventArray = this._events.get(event.name)
    return eventArray?.find((e) => e === event)
  }

  /** Destroys all event listeners in the manager. */
  public destroy() {
    this._events.forEach((eventArray, eventName) => {
      eventArray.forEach((event) => event.destroy())
      this._events.delete(eventName)
    })

    return this
  }
}
