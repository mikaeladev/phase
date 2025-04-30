import { SlashCommandAssertions } from "discord.js"

import type { BotCommandBody } from "@phasejs/core"
import type { LocalizationMap } from "discord.js"

export class SharedBotCommandBuilderName {
  declare protected body: BotCommandBody

  /**
   * Sets the name of this command.
   */
  public setName(name: string) {
    SlashCommandAssertions.validateName(name)
    this.body.name = name
    return this
  }

  /**
   * Sets the name localisations of this command.
   */
  public setNameLocalisations(localisations: LocalizationMap) {
    SlashCommandAssertions.validateLocalizationMap(localisations)
    this.body.name_localizations = localisations
    return this
  }
}
