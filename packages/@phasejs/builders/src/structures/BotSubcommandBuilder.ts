import { BotCommand } from "@phasejs/core"
import { ApplicationCommandOptionType } from "discord.js"

import { SUBCOMMAND_BUILDER_TAG } from "~/lib/constants"

import { BotCommandBuilderBase } from "~/structures/abstracts/BotCommandBuilderBase"

import type { BotClient } from "@phasejs/core"
import type { BotCommandBuilderBaseData } from "~/structures/abstracts/BotCommandBuilderBase"

export class BotSubcommandBuilder extends BotCommandBuilderBase {
  protected [SUBCOMMAND_BUILDER_TAG] = true

  declare protected _data: BotCommandBuilderBaseData<true>

  constructor() {
    super({
      body: {
        type: ApplicationCommandOptionType.Subcommand,
      },
    })
  }

  /** Sets the parent name of the subcommand. */
  public setParentName(parentName: string) {
    this._data.parentName = parentName
    return this
  }

  /** Sets the group name of the subcommand. */
  public setGroupName(groupName: string) {
    this._data.groupName = groupName
    return this
  }

  /** Builds the subcommand. */
  public build(phase: BotClient) {
    const { body, execute, ...rest } = this._data

    if (!body.name) throw new Error("Name not specified.")
    if (!body.description) throw new Error("Description not specified.")
    if (!execute) throw new Error("Execute not specified.")

    return new BotCommand(phase, {
      body: {
        name: body.name,
        description: body.description,
        ...body,
      },
      execute,
      ...rest,
    })
  }

  /** Creates a subcommand builder from a built subcommand. */
  static from(subcommand: BotCommand) {
    if (!subcommand.parentName) throw new Error("Parent name not specified.")

    const builder = new BotSubcommandBuilder()

    builder.setName(subcommand.name)
    builder.setParentName(subcommand.parentName)
    builder.setDescription(subcommand.description)
    builder.setMetadata(subcommand.metadata)
    builder.setExecute(subcommand.execute)

    if (subcommand.groupName) {
      builder.setGroupName(subcommand.groupName)
    }

    if (subcommand.nameLocalisations) {
      builder.setNameLocalisations(subcommand.nameLocalisations)
    }

    if (subcommand.descriptionLocalisations) {
      builder.setDescriptionLocalisations(subcommand.descriptionLocalisations)
    }

    if (subcommand.options) {
      builder.setOptions(subcommand.options)
    }

    return builder
  }

  /** Checks if a value is a subcommand builder. */
  static isBuilder(value: unknown): value is BotSubcommandBuilder {
    return value instanceof Object && SUBCOMMAND_BUILDER_TAG in value
  }
}
