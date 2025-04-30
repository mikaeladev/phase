import { BotCommand } from "@phasejs/core"
import { ApplicationCommandOptionType } from "discord.js"

import { Mixin } from "ts-mixer"

import { SUBCOMMAND_BUILDER_TAG } from "~/lib/constants"

import { SharedBotCommandBuilderBase } from "./shared/SharedBotCommandBuilderBase"
import { SharedBotCommandBuilderDescription } from "./shared/SharedBotCommandBuilderDescription"
import { SharedBotCommandBuilderName } from "./shared/SharedBotCommandBuilderName"
import { SharedBotCommandBuilderOptions } from "./shared/SharedBotCommandBuilderOptions"

import type { BotClient, BotCommandBody } from "@phasejs/core"

export class BotSubcommandBuilder extends Mixin(
  SharedBotCommandBuilderBase,
  SharedBotCommandBuilderName,
  SharedBotCommandBuilderDescription,
  SharedBotCommandBuilderOptions,
) {
  declare protected body: BotCommandBody<true>

  protected [SUBCOMMAND_BUILDER_TAG] = true

  constructor() {
    super()

    this.body.type = ApplicationCommandOptionType.Subcommand
  }

  /**
   * Builds the subcommand.
   */
  public build(
    phase: BotClient,
    params: { parentName?: string; groupName?: string } = {},
  ) {
    return new BotCommand(phase, {
      ...params,
      body: this.body,
      metadata: this.metadata,
      execute: this.execute,
    })
  }

  /**
   * Creates a subcommand builder from a subcommand.
   */
  static from(command: BotCommand) {
    const builder = new BotSubcommandBuilder()

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

    return builder
  }

  /**
   * Checks if something is a subcommand builder.
   */
  static isBuilder(thing: unknown): thing is BotSubcommandBuilder {
    return (
      typeof thing === "object" &&
      thing !== null &&
      SUBCOMMAND_BUILDER_TAG in thing
    )
  }
}
