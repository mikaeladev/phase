import { SlashCommandAssertions } from "discord.js"

import type { BotCommandBody } from "@phasejs/core"
import type { LocalizationMap } from "discord.js"

export class SharedBotCommandBuilderDescription {
  declare protected body: BotCommandBody

  /**
   * Sets the description of this command.
   */
  public setDescription(description: string) {
    SlashCommandAssertions.validateDescription(description)
    this.body.description = description
    return this
  }

  /**
   * Sets the description localisations of this command.
   */
  public setDescriptionLocalisations(localisations: LocalizationMap) {
    SlashCommandAssertions.validateLocalizationMap(localisations)
    this.body.description_localizations = localisations
    return this
  }
}
