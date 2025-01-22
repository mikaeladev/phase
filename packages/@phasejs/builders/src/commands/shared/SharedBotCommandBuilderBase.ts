import type {
  BotCommandBody,
  BotCommandExecute,
  BotCommandMetadata,
} from "@phasejs/core"

export class SharedBotCommandBuilderBase {
  protected body: BotCommandBody
  protected metadata: BotCommandMetadata
  protected execute: BotCommandExecute

  constructor() {
    this.body = {} as BotCommandBody
    this.metadata = {}
    this.execute = () => undefined
  }

  /**
   * Sets the metadata of this command.
   */
  public setMetadata(metadata: Omit<BotCommandMetadata, "type">) {
    this.metadata = metadata
    return this
  }

  /**
   * Sets the execute function of this command.
   */
  public setExecute(execute: BotCommandExecute) {
    this.execute = execute
    return this
  }
}
