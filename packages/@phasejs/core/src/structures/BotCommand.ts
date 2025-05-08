import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ApplicationIntegrationType,
} from "discord.js"

import { deepmergeCustom } from "deepmerge-ts"
import { isEqual, isNil } from "lodash"

import { Base } from "~/structures/abstracts/Base"

import type { BotClient } from "~/structures/BotClient"
import type { BotCommandBody, BotCommandExecute } from "~/types/commands"
import type { Optional } from "~/types/utils"
import type {
  APIApplicationCommandOption,
  ApplicationCommand,
  ApplicationCommandOptionData,
} from "discord.js"

export interface BotCommandMetadata extends Record<string, unknown> {}
export interface BotCommandContext extends Record<string, unknown> {}

export interface BotCommandParams {
  body: BotCommandBody
  parentName?: string
  groupName?: string
  metadata: BotCommandMetadata
  execute: BotCommandExecute
}

export class BotCommand
  extends Base
  implements Readonly<Omit<BotCommandParams, "body">>
{
  protected readonly _body: BotCommandBody

  public readonly subcommand
  public readonly parentName
  public readonly groupName
  public readonly metadata
  public readonly execute

  constructor(phase: BotClient, params: BotCommandParams) {
    super(phase)

    this._body = BotCommand.cleanBody(params.body)

    if (params.parentName) {
      this.subcommand = true
      this.parentName = params.parentName

      if (params.groupName) {
        this.groupName = params.groupName
      }
    } else {
      this.subcommand = false
    }

    this.metadata = params.metadata
    this.execute = params.execute
  }

  /**
   * 1-32 character name. Command names must be all lowercase matching
   * `^[-_\p{L}\p{N}\p{sc=Deva}\p{sc=Thai}]{1,32}$`
   */
  public get name(): BotCommandBody["name"] {
    return this._body.name
  }

  /**
   * Localisation dictionary for the name field. Values follow the same
   * restrictions as name.
   */
  public get nameLocalisations(): BotCommandBody["name_localizations"] {
    return this._body.name_localizations
  }

  /** 1-100 character description of the command. */
  public get description(): BotCommandBody["description"] {
    return this._body.description
  }

  /**
   * Localisation dictionary for the description field. Values follow the same
   * restrictions as description.
   */
  public get descriptionLocalisations(): BotCommandBody["description_localizations"] {
    return this._body.description_localizations
  }

  /** The parameters for the command, max 25. */
  public get options(): BotCommandBody["options"] {
    return this._body.options
  }

  /**
   * Installation context(s) where the command is available, only for
   * globally-scoped commands. Defaults to `GUILD_INSTALL ([0])`.
   */
  public get integrationTypes(): Optional<
    BotCommandBody<false>["integration_types"]
  > {
    if (this.isSubcommandBody(this._body)) return undefined
    return this._body.integration_types
  }

  /**
   * Interaction context(s) where the command can be used, only for
   * globally-scoped commands. By default, all interaction context types
   * included for new commands `[0,1,2]`.
   */
  public get contexts(): Optional<BotCommandBody<false>["contexts"]> {
    if (this.isSubcommandBody(this._body)) return undefined
    return this._body.contexts
  }

  /**
   * Indicates whether the command is available in DMs with the app, only for
   * globally-scoped commands. By default, commands are visible.
   *
   * @deprecated Use `contexts` instead.
   */
  public get dmPermission(): Optional<BotCommandBody<false>["dm_permission"]> {
    if (this.isSubcommandBody(this._body)) return undefined
    return this._body.dm_permission
  }

  /** Returns the command body as a JSON object. */
  public toJSON(): BotCommandBody<false> {
    if (!this.isSubcommandBody(this._body)) {
      return this._body
    }

    return {
      type: ApplicationCommandType.ChatInput,
      name: this.parentName!,
      description: this.parentName!,
      options: [
        this.groupName
          ? {
              type: ApplicationCommandOptionType.SubcommandGroup,
              name: this.groupName,
              description: this.groupName,
              options: [this._body],
            }
          : {
              ...this._body,
            },
      ],
      integration_types: [ApplicationIntegrationType.GuildInstall],
      dm_permission: true,
    }
  }

  private isSubcommandBody(
    _body: BotCommandBody,
  ): _body is BotCommandBody<true> {
    return this.parentName !== undefined
  }

  /** Compares two command bodies for equality. */
  static equals(this: void, a: BotCommandBody, b: BotCommandBody) {
    return isEqual(a, b)
  }

  /** Removes unnecessary properties from a command body. */
  static cleanBody<T extends BotCommandBody>(this: void, body: T): T {
    if ("name_localizations" in body) {
      if (!body.name_localizations) {
        delete body.name_localizations
      }
    }

    if ("description_localizations" in body) {
      if (!body.description_localizations) {
        delete body.description_localizations
      }
    }

    if ("options" in body) {
      if (body.options) {
        const options = body.options.map(BotCommand.transformOption)
        body.options = options
      } else {
        delete body.options
      }
    }

    return body
  }

  /**
   * Transforms an application command option object into a format compatible
   * with the Discord API.
   */
  static transformOption(
    this: void,
    option: ApplicationCommandOptionData | APIApplicationCommandOption,
  ): APIApplicationCommandOption {
    const transformedOption: Record<string, unknown> = {
      type: option.type,
      name: option.name,
      description: option.description,
    }

    const assignProp = (camelProp: string, snakeProp: string) => {
      type Prop = keyof typeof option

      if (camelProp in option && !isNil(option[camelProp as Prop])) {
        transformedOption[snakeProp] = option[camelProp as Prop]
      }
      if (snakeProp in option && !isNil(option[snakeProp as Prop])) {
        transformedOption[snakeProp] = option[snakeProp as Prop]
      }
    }

    assignProp("nameLocalizations", "name_localizations")
    assignProp("descriptionLocalizations", "description_localizations")
    assignProp("required", "required")
    assignProp("autocomplete", "autocomplete")
    assignProp("channelTypes", "channel_types")
    assignProp("minValue", "min_value")
    assignProp("maxValue", "max_value")
    assignProp("minLength", "min_length")
    assignProp("maxLength", "max_length")

    if ("choices" in option && option.choices) {
      transformedOption.choices = option.choices.map((c) => {
        const transformedChoice: Record<string, unknown> = {
          name: c.name,
          value: c.value,
        }

        if ("nameLocalizations" in c && !isNil(c.nameLocalizations)) {
          transformedChoice.name_localizations = c.nameLocalizations
        }
        if ("name_localizations" in c && !isNil(c.name_localizations)) {
          transformedChoice.name_localizations = c.name_localizations
        }

        return transformedChoice
      })
    }

    if ("options" in option && option.options) {
      transformedOption.options = option.options.map((opt) =>
        BotCommand.transformOption(opt),
      )
    }

    return transformedOption as unknown as APIApplicationCommandOption
  }

  /**
   * Transforms an application command object into a format compatible with the
   * Discord API.
   */
  static transformCommand(
    this: void,
    command: ApplicationCommand,
  ): BotCommandBody<false> {
    const transformedCommand: BotCommandBody = {
      type: ApplicationCommandType.ChatInput,
      name: command.name,
      description: command.description,
      options:
        command.options.map((option) =>
          BotCommand.transformOption(option as ApplicationCommandOptionData),
        ) ?? [],
      integration_types: command.integrationTypes ?? [
        ApplicationIntegrationType.GuildInstall,
      ],
      dm_permission: !isNil(command.dmPermission) ? command.dmPermission : true,
    }

    if (command.nameLocalizations) {
      transformedCommand.name_localizations = command.nameLocalizations
    }

    if (command.descriptionLocalizations) {
      transformedCommand.description_localizations =
        command.descriptionLocalizations
    }

    if (command.contexts) {
      transformedCommand.contexts = command.contexts
    }

    return transformedCommand
  }

  /** Merges 2 command bodies. */
  static mergeCommands = deepmergeCustom({
    mergeArrays(values, utils) {
      const merged = new Map<unknown, unknown>()
      values.flat().forEach((item) => {
        if (typeof item === "object" && item !== null && "name" in item) {
          const existingItem = merged.get(item.name)
          if (existingItem) {
            merged.set(item.name, utils.deepmerge(existingItem, item))
          } else {
            merged.set(item.name, item)
          }
        } else {
          merged.set(item, item)
        }
      })
      return Array.from(merged.values())
    },
  })
}
