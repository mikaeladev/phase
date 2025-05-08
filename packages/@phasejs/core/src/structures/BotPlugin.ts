import type {
  BotPluginLoadFunction,
  BotPluginLoadTrigger,
  BotPluginVersion,
} from "~/types/plugins"

export interface BotPluginParams<TTrigger extends BotPluginLoadTrigger> {
  name: string
  version: BotPluginVersion
  trigger: TTrigger
  onLoad: BotPluginLoadFunction<TTrigger>
}

export class BotPlugin<
  TTrigger extends BotPluginLoadTrigger = BotPluginLoadTrigger,
> implements Readonly<BotPluginParams<TTrigger>>
{
  public readonly name
  public readonly version
  public readonly trigger
  public readonly onLoad

  constructor(params: BotPluginParams<TTrigger>) {
    this.name = params.name
    this.version = params.version
    this.trigger = params.trigger
    this.onLoad = params.onLoad
  }
}
