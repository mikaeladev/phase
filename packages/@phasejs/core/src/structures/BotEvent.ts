import { Base } from "~/structures/abstracts/Base"

import type { BotClient } from "~/structures/BotClient"
import type {
  BotEventExecute,
  BotEventExecuteArgsMap,
  BotEventName,
} from "~/types/events"

export enum BotEventListenerType {
  ON = "on",
  ONCE = "once",
}

export interface BotEventMetadata extends Record<string, unknown> {}
export interface BotEventContext extends Record<string, unknown> {}

export interface BotEventParams<TName extends BotEventName = BotEventName> {
  name: TName
  listenerType: BotEventListenerType
  metadata: BotEventMetadata
  execute: BotEventExecute<TName>
}

export class BotEvent<TName extends BotEventName = BotEventName>
  extends Base
  implements Readonly<BotEventParams<TName>>
{
  public readonly name
  public readonly listenerType
  public readonly metadata
  public readonly execute

  constructor(phase: BotClient, params: BotEventParams<TName>) {
    super(phase)

    this.name = params.name
    this.listenerType = params.listenerType
    this.metadata = params.metadata
    this.execute = params.execute

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
          if (this.listenerType === BotEventListenerType.ONCE) {
            this.destroy()
          }
        }
      })()
    })
  }

  /** Destroys the event listener. */
  public destroy() {
    this.phase.client.removeListener(this.name, this.execute)
  }
}
