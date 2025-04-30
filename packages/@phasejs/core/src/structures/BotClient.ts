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
import type { BotPrestart } from "~/types/prestart"

export interface BotClientOptions {
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
  ready: BotClient<true>

  init: BotClient<false>
  initCommand: BotCommand
  initCron: BotCron
  initEvent: BotEvent
  initMiddleware: BotMiddleware
  initPlugin: BotPlugin

  liveCommandCreate: BotCommandBody
  liveCommandDelete: BotCommandBody
  liveCommandUpdate: BotCommandBody

  commandRun: BotCommand
  cronRun: BotCron
  eventRun: BotEvent
  prestartRun: BotPrestart
  middlewareRun: BotMiddleware
}

export class BotClient<TReady extends boolean = boolean> {
  public readonly emitter: Emittery<BotClientEvents>
  public readonly client: DjsClient<TReady>

  public readonly plugins: BotPlugin[]
  public readonly contextCreators: BotContextCreators

  public readonly commands: CommandManager
  public readonly crons: CronManager
  public readonly events: EventManager

  constructor(client: DjsClient<TReady>, options: BotClientOptions) {
    this.emitter = new Emittery()
    this.client = client

    this.plugins = options.plugins ?? []
    this.contextCreators = options.contextCreators ?? baseBotContextCreators

    this.commands = new CommandManager(this)
    this.crons = new CronManager(this)
    this.events = new EventManager(this)

    this.client.phase = this

    if (process.env.DISCORD_TOKEN) {
      this.setToken(process.env.DISCORD_TOKEN)
    }
  }

  public isReady(): this is BotClient<true> {
    return this.client.isReady()
  }

  public async init(bot: BotClientInitParams): Promise<BotClient<true>> {
    for (const plugin of this.plugins.filter((p) => p.trigger === "init")) {
      await plugin.onLoad(this)
      await this.emitter.emit("initPlugin", plugin)
    }

    void this.emitter.emit("init", this as BotClient<false>)

    if (bot.prestart) {
      await bot.prestart((this as BotClient<false>).client)
      void this.emitter.emit("prestartRun", bot.prestart)
    }

    for (const plugin of this.plugins.filter((p) => p.trigger === "startup")) {
      await plugin.onLoad(this)
      await this.emitter.emit("initPlugin", plugin)
    }

    if (bot.middlewares) {
      if (bot.middlewares.commands) this.commands.use(bot.middlewares.commands)
      void this.emitter.emit("initMiddleware", bot.middlewares)
    }

    await Promise.all([
      ...bot.commands.map((command) => this.commands.create(command)),
      ...bot.crons.map((cron) => this.crons.create(cron)),
      ...bot.events.map((event) => this.events.create(event)),
    ])

    await this.client.login()

    for (const plugin of this.plugins.filter((p) => p.trigger === "ready")) {
      await plugin.onLoad(this)
      void this.emitter.emit("initPlugin", plugin)
    }

    void this.emitter.emit("ready", this as BotClient<true>)

    return this as BotClient<true>
  }

  public setToken(token: string) {
    if (this.isReady()) throw new Error("Client is already ready.")
    const client = this.client as DjsClient<false>
    client.token = token
    client.rest.setToken(token)
  }
}
