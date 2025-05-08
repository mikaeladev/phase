import { BotCommand } from "@phasejs/core"
import { ApplicationCommandType, ApplicationIntegrationType } from "discord.js"

import { COMMAND_BUILDER_TAG } from "~/lib/constants"

import { BotCommandBuilderBase } from "~/structures/abstracts/BotCommandBuilderBase"

import type { BotClient } from "@phasejs/core"
import type { BotCommandBuilderBaseData } from "~/structures/abstracts/BotCommandBuilderBase"
import type { InteractionContextType } from "discord.js"

export class BotCommandBuilder extends BotCommandBuilderBase {
  protected [COMMAND_BUILDER_TAG] = true

  declare protected _data: BotCommandBuilderBaseData<false>

  constructor() {
    super({
      body: {
        type: ApplicationCommandType.ChatInput,
        integration_types: [ApplicationIntegrationType.GuildInstall],
        options: [],
        dm_permission: true,
      },
    })
  }

  /** Sets the DM permission of the command. */
  public setDMPermission(enabled: boolean) {
    this._data.body.dm_permission = enabled
    return this
  }

  /** Sets the interaction contexts of the command. */
  public setContexts(contexts: InteractionContextType[]) {
    this._data.body.contexts = contexts
    return this
  }

  /** Sets the integration types of the command. */
  public setIntegrationTypes(integrationTypes: ApplicationIntegrationType[]) {
    this._data.body.integration_types = integrationTypes
    return this
  }

  /** Builds the command. */
  public build(phase: BotClient) {
    const { body, metadata, execute } = this._data

    if (!body.name) throw new Error("Name not specified.")
    if (!body.description) throw new Error("Description not specified.")
    if (!execute) throw new Error("Execute not specified.")

    return new BotCommand(phase, {
      body: {
        name: body.name,
        description: body.description,
        ...body,
      },
      metadata,
      execute,
    })
  }

  /** Creates a command builder from a built command. */
  static from(command: BotCommand) {
    const builder = new BotCommandBuilder()

    builder.setName(command.name)
    builder.setDescription(command.description)
    builder.setMetadata(command.metadata)
    builder.setExecute(command.execute)

    if (command.nameLocalisations) {
      builder.setNameLocalisations(command.nameLocalisations)
    }

    if (command.descriptionLocalisations) {
      builder.setDescriptionLocalisations(command.descriptionLocalisations)
    }

    if (command.options) {
      builder.setOptions(command.options)
    }

    if (command.dmPermission !== undefined) {
      builder.setDMPermission(command.dmPermission)
    }

    if (command.contexts) {
      builder.setContexts(command.contexts)
    }

    if (command.integrationTypes) {
      builder.setIntegrationTypes(command.integrationTypes)
    }

    return builder
  }

  /** Checks if a value is a command builder. */
  static isBuilder(value: unknown): value is BotCommandBuilder {
    return value instanceof Object && COMMAND_BUILDER_TAG in value
  }
}
