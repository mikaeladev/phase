import {
  SlashCommandAssertions,
  SlashCommandAttachmentOption,
  SlashCommandBooleanOption,
  SlashCommandChannelOption,
  SlashCommandIntegerOption,
  SlashCommandMentionableOption,
  SlashCommandNumberOption,
  SlashCommandRoleOption,
  SlashCommandStringOption,
  SlashCommandUserOption,
} from "discord.js"

import { resolveBuilder } from "~/lib/resolvers"

import type { BotCommandBody, BotCommandParams } from "@phasejs/core"
import type { BuilderOrBuilderFunction } from "~/types/builders"
import type { PartialWithRequired } from "~/types/utils"
import type {
  APIApplicationCommandOption,
  ApplicationCommandOptionBase,
  LocalizationMap,
} from "discord.js"

export type BotCommandBuilderBaseData<T extends boolean = boolean> =
  PartialWithRequired<
    Omit<BotCommandParams, "body"> & { body: Partial<BotCommandBody<T>> },
    "body" | "metadata"
  >

export abstract class BotCommandBuilderBase {
  protected _data: BotCommandBuilderBaseData

  constructor(data?: Partial<BotCommandBuilderBaseData>) {
    const { body, metadata, ...rest } = data ?? {}

    this._data = {
      body: { ...body },
      metadata: { ...metadata },
      ...rest,
    }
  }

  /** Sets the name of the command. */
  public setName(name: string) {
    SlashCommandAssertions.validateName(name)
    this._data.body.name = name
    return this
  }

  /** Sets the name localisations for the command. */
  public setNameLocalisations(localisations: LocalizationMap) {
    SlashCommandAssertions.validateLocalizationMap(localisations)
    this._data.body.name_localizations = localisations
    return this
  }

  /** Sets the description of the command. */
  public setDescription(description: string) {
    SlashCommandAssertions.validateDescription(description)
    this._data.body.description = description
    return this
  }

  /** Sets the description localisations of the command. */
  public setDescriptionLocalisations(localisations: LocalizationMap) {
    SlashCommandAssertions.validateLocalizationMap(localisations)
    this._data.body.description_localizations = localisations
    return this
  }

  /** Sets the metadata attached to the command. */
  public setMetadata(metadata: BotCommandParams["metadata"]) {
    this._data.metadata = metadata
    return this
  }

  /** Sets the function to execute when the command is triggered. */
  public setExecute(execute: BotCommandParams["execute"]) {
    this._data.execute = execute
    return this
  }

  /** Sets the options for the command. */
  public setOptions(options: APIApplicationCommandOption[]) {
    this._data.body.options = options
    return this
  }

  /** Adds an attachment option to the command. */
  public addAttachmentOption(
    option: BuilderOrBuilderFunction<SlashCommandAttachmentOption>,
  ) {
    return this._addOption(SlashCommandAttachmentOption, option)
  }

  /** Adds a boolean option to the command. */
  public addBooleanOption(
    option: BuilderOrBuilderFunction<SlashCommandBooleanOption>,
  ) {
    return this._addOption(SlashCommandBooleanOption, option)
  }

  /** Adds a channel option to the command. */
  public addChannelOption(
    option: BuilderOrBuilderFunction<SlashCommandChannelOption>,
  ) {
    return this._addOption(SlashCommandChannelOption, option)
  }

  /** Adds an integer option to the command. */
  public addIntegerOption(
    option: BuilderOrBuilderFunction<SlashCommandIntegerOption>,
  ) {
    return this._addOption(SlashCommandIntegerOption, option)
  }

  /** Adds a mentionable option to the command. */
  public addMentionableOption(
    option: BuilderOrBuilderFunction<SlashCommandMentionableOption>,
  ) {
    return this._addOption(SlashCommandMentionableOption, option)
  }

  /** Adds a number option to the command. */
  public addNumberOption(
    option: BuilderOrBuilderFunction<SlashCommandNumberOption>,
  ) {
    return this._addOption(SlashCommandNumberOption, option)
  }

  /** Adds a role option to the command. */
  public addRoleOption(
    option: BuilderOrBuilderFunction<SlashCommandRoleOption>,
  ) {
    return this._addOption(SlashCommandRoleOption, option)
  }

  /** Adds a string option to the command. */
  public addStringOption(
    option: BuilderOrBuilderFunction<SlashCommandStringOption>,
  ) {
    return this._addOption(SlashCommandStringOption, option)
  }

  /** Adds a user option to the command. */
  public addUserOption(
    option: BuilderOrBuilderFunction<SlashCommandUserOption>,
  ) {
    return this._addOption(SlashCommandUserOption, option)
  }

  /** Adds an option the command. */
  protected _addOption<OptionBuilder extends ApplicationCommandOptionBase>(
    Constructor: new () => OptionBuilder,
    option: BuilderOrBuilderFunction<OptionBuilder>,
  ): this {
    const resolved = resolveBuilder(option, Constructor)

    this._data.body.options ??= []
    this._data.body.options.push(resolved.toJSON())

    return this
  }
}
