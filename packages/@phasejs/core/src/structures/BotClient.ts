import Emittery from "emittery"

import { baseBotContextCreators } from "~/lib/constants"

import { CommandManager } from "~/managers/CommandManager"
import { CronManager } from "~/managers/CronManager"
import { EventManager } from "~/managers/EventManager"

import type { BotCommand } from "~/structures/BotCommand"
import type { BotCron } from "~/structures/BotCron"
import type { BotEvent } from "~/structures/BotEvent"
import type { BotPlugin } from "~/structures/BotPlugin"
import type { DjsClient } from "~/types/client"
import type { BotCommandBody } from "~/types/commands"
import type { BotContextCreators } from "~/types/context"
import type { BotMiddleware } from "~/types/middleware"
import type { BotPluginLoadTrigger } from "~/types/plugins"
import type { BotPrestart } from "~/types/prestart"

export interface BotClientParams {
  plugins?: BotPlugin[]
  contextCreators?: BotContextCreators
}

export interface BotClientInitParams {
  prestart?: BotPrestart
  middlewares?: BotMiddleware
  commands: BotCommand[]
  crons: BotCron[]
  events: BotEvent[]
}

export interface BotClientEvents {
  phaseInit: BotClient<false>
  phaseStart: BotClient<false>
  phaseReady: BotClient<true>

  commandCreate: BotCommand
  commandDelete: BotCommand
  commandExecute: BotCommand
  commandSyncCreate: BotCommandBody<false>
  commandSyncDelete: BotCommandBody<false>
  commandSyncUpdate: BotCommandBody<false>

  cronCreate: BotCron
  cronDelete: BotCron
  cronExecute: BotCron

  eventCreate: BotEvent
  eventDelete: BotEvent
  eventExecute: BotEvent
}

export class BotClient<TReady extends boolean = boolean> {
  public readonly emitter: Emittery<BotClientEvents>
  public readonly client: DjsClient<TReady>
  public readonly plugins: BotPlugin[]
  public readonly contextCreators: BotContextCreators

  public readonly middlewares: BotMiddleware = {}
  public readonly commands: CommandManager
  public readonly crons: CronManager
  public readonly events: EventManager

  constructor(client: DjsClient<TReady>, params: BotClientParams) {
    this.emitter = new Emittery()
    this.client = client
    this.client.phase = this
    this.plugins = params.plugins ?? []
    this.contextCreators = params.contextCreators ?? baseBotContextCreators

    this.commands = new CommandManager(this)
    this.crons = new CronManager(this)
    this.events = new EventManager(this)

    if (process.env.DISCORD_TOKEN) {
      this.setToken(process.env.DISCORD_TOKEN)
    }
  }

  public isReady(): this is BotClient<true> {
    return this.client.isReady()
  }

  public async init(params: BotClientInitParams): Promise<BotClient<true>> {
    await this.initPlugins("init")
    await this.emitter.emit("phaseInit", this as BotClient<false>)

    if (params.middlewares) {
      Reflect.set(this, "middlewares", params.middlewares)
    }

    if (params.prestart) {
      await params.prestart((this as BotClient<false>).client)
    }

    await this.initPlugins("startup")
    await this.emitter.emit("phaseStart", this as BotClient<false>)

    await Promise.all([
      ...params.commands.map((command) => this.commands.create(command)),
      ...params.crons.map((cron) => this.crons.create(cron)),
      ...params.events.map((event) => this.events.create(event)),
    ])

    await this.client.login()

    await this.initPlugins("ready")
    await this.emitter.emit("phaseReady", this as BotClient<true>)

    return this as BotClient<true>
  }

  public setToken(token: string) {
    if (this.isReady()) throw new Error("Client is already ready.")
    const client = this.client as DjsClient<false>
    client.token = token
    client.rest.setToken(token)
  }

  private async initPlugins(trigger: BotPluginLoadTrigger) {
    const plugins = this.plugins.filter((p) => p.trigger === trigger)

    for (const plugin of plugins) {
      await plugin.onLoad(this)
    }
  }
}
