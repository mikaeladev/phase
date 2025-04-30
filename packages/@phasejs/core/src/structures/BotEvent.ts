import { Base } from "~/structures/abstracts/Base"

import type { BotClient } from "~/structures/BotClient"
import type {
  BotEventExecute,
  BotEventExecuteArgsMap,
  BotEventListenerType,
  BotEventName,
} from "~/types/events"

export interface BotEventMetadata extends Record<string, unknown> {}
export interface BotEventContext extends Record<string, unknown> {}

export class BotEvent<TName extends BotEventName = BotEventName> extends Base {
  protected _init = false

  public readonly name: TName
  public readonly listenerType: BotEventListenerType
  public readonly metadata: BotEventMetadata
  public readonly execute: BotEventExecute<TName>

  constructor(
    phase: BotClient,
    params: {
      name: TName
      listenerType: BotEventListenerType
      metadata: BotEventMetadata
      execute: BotEventExecute<TName>
    },
  ) {
    super(phase)

    this.name = params.name
    this.listenerType = params.listenerType
    this.metadata = params.metadata
    this.execute = params.execute
  }

  /**
   * Initialises the event listener.
   *
   * @throws If the event is already initialised.
   */
  public init() {
    if (this._init) {
      throw new Error("Event has already been initialised.")
    }

    this.phase.client[this.listenerType](this.name, (...args) => {
      void (async () => {
        const ctx = await this.phase.contextCreators.events({
          event: this as unknown as BotEvent,
          phase: this.phase,
        })

        const executeArgs = [
          this.phase.client,
          ...args,
          ctx,
        ] as BotEventExecuteArgsMap[TName]

        try {
          await this.execute(...executeArgs)
        } catch (error) {
          console.error(`Error occurred in '${this.name}' event:`)
          console.error(error)
        } finally {
          if (this.listenerType === "once") {
            this.destroy()
          }
        }
      })()
    })

    this._init = true
    return this
  }

  /**
   * Destroys the event listener.
   */
  public destroy() {
    this.phase.client.removeListener(this.name, this.execute)
    this._init = false
    return this
  }
}
