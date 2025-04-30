import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ApplicationIntegrationType,
} from "discord.js"

import { isEqual, isNil } from "lodash"

import { Base } from "~/structures/abstracts/Base"

import type { BotClient } from "~/structures/BotClient"
import type { BotCommandBody, BotCommandExecute } from "~/types/commands"
import type {
  APIApplicationCommandOption,
  ApplicationCommand,
  ApplicationCommandOptionData,
} from "discord.js"

export interface BotCommandMetadata extends Record<string, unknown> {}
export interface BotCommandContext extends Record<string, unknown> {}

export class BotCommand extends Base {
  protected _body: BotCommandBody

  public readonly parentName?: string
  public readonly groupName?: string

  public readonly name: BotCommandBody["name"]
  public readonly nameLocalisations: BotCommandBody["name_localizations"]
  public readonly description: BotCommandBody["description"]
  public readonly descriptionLocalisations: BotCommandBody["description_localizations"]
  public readonly options: BotCommandBody["options"]

  public readonly integrationTypes?: BotCommandBody<false>["integration_types"]
  public readonly contexts?: BotCommandBody<false>["contexts"]
  public readonly dmPermission?: BotCommandBody<false>["dm_permission"]

  public readonly metadata: BotCommandMetadata
  public readonly execute: BotCommandExecute

  public get subcommand(): boolean {
    return this.isSubcommandBody(this._body)
  }

  constructor(
    phase: BotClient,
    params: {
      parentName?: string
      groupName?: string
      body: BotCommandBody
      metadata: BotCommandMetadata
      execute: BotCommandExecute
    },
  ) {
    super(phase)

    this._body = params.body

    if (params.parentName) {
      this.parentName = params.parentName

      if (params.groupName) {
        this.groupName = params.groupName
      }
    }

    this.name = this._body.name
    this.description = this._body.description

    if ("name_localizations" in this._body) {
      if (this._body.name_localizations) {
        this.nameLocalisations = this._body.name_localizations
      } else {
        delete this._body.name_localizations
      }
    }

    if ("description_localizations" in this._body) {
      if (this._body.description_localizations) {
        this.descriptionLocalisations = this._body.description_localizations
      } else {
        delete this._body.description_localizations
      }
    }

    if ("options" in this._body) {
      if (this._body.options) {
        const transformedOptions = this._body.options.map((option) => {
          return BotCommand.transformOption(option)
        })

        this._body.options = transformedOptions
        this.options = transformedOptions
      } else {
        delete this._body.options
      }
    }

    if (!this.isSubcommandBody(this._body)) {
      this.integrationTypes = this._body.integration_types
      this.contexts = this._body.contexts
      this.dmPermission = this._body.dm_permission
    }

    this.metadata = params.metadata
    this.execute = params.execute
  }

  /**
   * Returns the command body as a JSON object.
   */
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

  /**
   * Compares two command bodies for equality.
   */
  static equals(a: BotCommandBody, b: BotCommandBody) {
    return isEqual(a, b)
  }

  /**
   * Transforms a command option into a format compatible with the Discord API.
   */
  static transformOption<
    TReturn extends APIApplicationCommandOption = APIApplicationCommandOption,
  >(
    option: ApplicationCommandOptionData | APIApplicationCommandOption,
  ): TReturn {
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
        this.transformOption(opt),
      )
    }

    return transformedOption as TReturn
  }

  /**
   * Transforms a command into a format compatible with the Discord API.
   */
  static transformCommand(command: ApplicationCommand): BotCommandBody<false> {
    const transformedCommand: BotCommandBody = {
      type: ApplicationCommandType.ChatInput,
      name: command.name,
      description: command.description,
      options:
        command.options.map((option) =>
          this.transformOption(option as ApplicationCommandOptionData),
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
}
