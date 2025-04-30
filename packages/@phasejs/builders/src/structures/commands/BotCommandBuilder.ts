import { BotCommand } from "@phasejs/core"
import { ApplicationCommandType, ApplicationIntegrationType } from "discord.js"

import { Mixin } from "ts-mixer"

import { COMMAND_BUILDER_TAG } from "~/lib/constants"

import { SharedBotCommandBuilderBase } from "./shared/SharedBotCommandBuilderBase"
import { SharedBotCommandBuilderDescription } from "./shared/SharedBotCommandBuilderDescription"
import { SharedBotCommandBuilderName } from "./shared/SharedBotCommandBuilderName"
import { SharedBotCommandBuilderOptions } from "./shared/SharedBotCommandBuilderOptions"

import type { BotClient, BotCommandBody } from "@phasejs/core"
import type { InteractionContextType } from "discord.js"

export class BotCommandBuilder extends Mixin(
  SharedBotCommandBuilderBase,
  SharedBotCommandBuilderName,
  SharedBotCommandBuilderDescription,
  SharedBotCommandBuilderOptions,
) {
  declare protected body: BotCommandBody<false>

  protected [COMMAND_BUILDER_TAG] = true

  constructor() {
    super()

    this.body.type = ApplicationCommandType.ChatInput
    this.body.integration_types = [ApplicationIntegrationType.GuildInstall]
    this.body.options = []
    this.body.dm_permission = true
  }

  /**
   * Sets the DM permission of this command.
   */
  public setDMPermission(enabled: boolean) {
    this.body.dm_permission = enabled
    return this
  }

  /**
   * Sets the interaction contexts of this command.
   */
  public setContexts(contexts: InteractionContextType[]) {
    this.body.contexts = contexts
    return this
  }

  /**
   * Sets the integration types of this command.
   */
  public setIntegrationTypes(integrationTypes: ApplicationIntegrationType[]) {
    this.body.integration_types = integrationTypes
    return this
  }

  /**
   * Builds the command.
   */
  public build(phase: BotClient) {
    return new BotCommand(phase, {
      body: this.body,
      metadata: this.metadata,
      execute: this.execute,
    })
  }

  /**
   * Creates a command builder from a command.
   */
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

  /**
   * Checks if something is a command builder.
   */
  static isBuilder(thing: unknown): thing is BotCommandBuilder {
    return (
      typeof thing === "object" &&
      thing !== null &&
      COMMAND_BUILDER_TAG in thing
    )
  }
}
