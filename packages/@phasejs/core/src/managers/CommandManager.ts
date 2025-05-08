import { ChatInputCommandInteraction, Collection } from "discord.js"

import { Base } from "~/structures/abstracts/Base"
import { BotCommand } from "~/structures/BotCommand"

import type { BotClient } from "~/structures/BotClient"
import type { DjsClient } from "~/types/client"
import type { BotCommandBody, BotCommandNameResolvable } from "~/types/commands"

export class CommandManager extends Base {
  protected readonly _commands: Collection<string, BotCommand>

  constructor(phase: BotClient) {
    super(phase)

    this._commands = new Collection()

    phase.client.once("ready", (client) => {
      void this.sync(client)
    })

    phase.client.on("interactionCreate", (interaction) => {
      if (!interaction.isChatInputCommand()) return
      void this.execute(interaction)
    })
  }

  /** Adds a command to the manager. */
  public create(command: BotCommand) {
    if (this.phase.isReady()) {
      throw new Error("Commands cannot be created post client initialisation")
    }

    const name = this.resolveName(command)

    if (this.has(name)) {
      throw new Error(`Duplicate command detected: '${name}'`)
    }

    this._commands.set(name, command)

    void this.phase.emitter.emit("commandCreate", command)
  }

  /** Removes a command from the manager. */
  public delete(name: string) {
    if (this.phase.isReady()) {
      throw new Error("Commands cannot be deleted post client initialisation")
    }

    const command = this.get(name)
    if (!command) return

    this._commands.delete(name)

    void this.phase.emitter.emit("commandDelete", command)
  }

  /** Checks if a command exists in the manager. */
  public has(name: string) {
    return this._commands.has(name)
  }

  /** Gets a command from the manager. */
  public get(name: string) {
    return this._commands.get(name)
  }

  /** Gets the full name of a command. */
  public resolveName(commandNameResolvable: BotCommandNameResolvable) {
    if (commandNameResolvable instanceof ChatInputCommandInteraction) {
      const interaction = commandNameResolvable

      const fullNameParts = [
        interaction.commandName,
        interaction.options.getSubcommandGroup(false),
        interaction.options.getSubcommand(false),
      ]

      return fullNameParts.filter(Boolean).join(" ")
    }

    if (commandNameResolvable instanceof BotCommand) {
      const command = commandNameResolvable

      const parentName = command.parentName
      const groupName = command.groupName
      const commandName = command.name

      const fullNameParts = [parentName, groupName, commandName]

      return fullNameParts.filter(Boolean).join(" ")
    }

    return commandNameResolvable
  }

  /** Syncs commands with the Discord API. */
  private async sync(client: DjsClient<true>) {
    const localAPICommands = new Collection<string, BotCommandBody<false>>()
    const remoteAPICommands = new Collection<string, BotCommandBody<false>>()

    // populate the local api command collection
    const localJSONCommands = this._commands.map((command) => command.toJSON())

    for (const jsonCommand of localJSONCommands) {
      const existingAPICommand = localAPICommands.get(jsonCommand.name) ?? {}
      const updatedAPICommand = BotCommand.mergeCommands(
        existingAPICommand,
        jsonCommand,
      )

      localAPICommands.set(updatedAPICommand.name, updatedAPICommand)
    }

    // populate the remote api command collection
    const remoteAppCommands = await client.application.commands.fetch()

    for (const appCommand of remoteAppCommands.values()) {
      const transformedAppCommand = BotCommand.transformCommand(appCommand)

      remoteAPICommands.set(transformedAppCommand.name, transformedAppCommand)
    }

    const getCommandId = (localCommand: BotCommandBody<false>) => {
      return remoteAppCommands.find(
        (remoteCommand) => remoteCommand.name === localCommand.name,
      )?.id
    }

    // determine which commands to create
    const commandsToCreate = localAPICommands.filter(
      (command) => !remoteAPICommands.has(command.name),
    )

    // determine which commands to delete
    const commandsToDelete = remoteAPICommands.filter(
      (command) => !localAPICommands.has(command.name),
    )

    // determine which commands to update
    const commandsToUpdate = localAPICommands.filter((command) => {
      return (
        !commandsToCreate.has(command.name) &&
        !commandsToDelete.has(command.name) &&
        !BotCommand.equals(command, remoteAPICommands.get(command.name)!)
      )
    })

    // determine how many commands to sync
    const commandsToSync =
      commandsToCreate.size + commandsToDelete.size + commandsToUpdate.size

    // if there are no commands to sync, return early
    if (!commandsToSync) return

    const createPromises = commandsToCreate.map(async (command) => {
      await client.application.commands.create(command)
      void this.phase.emitter.emit("commandSyncCreate", command)
    })

    const deletePromises = commandsToDelete.map(async (command) => {
      const commandId = getCommandId(command)!
      await client.application.commands.delete(commandId)
      void this.phase.emitter.emit("commandSyncDelete", command)
    })

    const updatePromises = commandsToUpdate.map(async (command) => {
      const commandId = getCommandId(command)!
      await client.application.commands.edit(commandId, command)
      void this.phase.emitter.emit("commandSyncUpdate", command)
    })

    try {
      await Promise.all([
        ...createPromises,
        ...deletePromises,
        ...updatePromises,
      ])
    } catch (error) {
      console.error(`Failed to sync commands:`)
      console.error(error)
    }
  }

  /** Executes a command. */
  private async execute(interaction: ChatInputCommandInteraction) {
    const commandName = this.resolveName(interaction)
    const command = this.get(commandName)

    if (!command) return

    try {
      const middleware = this.phase.middlewares.commands

      const ctx = await this.phase.contextCreators.commands({
        command,
        phase: this.phase,
      })

      if (middleware) {
        return await middleware(interaction, ctx, command.execute)
      }

      return await command.execute(interaction, ctx)
    } catch (error) {
      console.error(`Error occurred in '${commandName}' command:`)
      console.error(error)
    }
  }
}
