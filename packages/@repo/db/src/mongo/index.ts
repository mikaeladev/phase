import { connect, connection, ConnectionStates, disconnect } from "mongoose"

import { afks } from "~/mongo/models/afks"
import { configs } from "~/mongo/models/configs"
import { giveaways } from "~/mongo/models/giveaways"
import { guilds } from "~/mongo/models/guilds"
import { joinToCreates } from "~/mongo/models/join-to-creates"
import { levels } from "~/mongo/models/levels"
import { otps } from "~/mongo/models/otps"
import { reminders } from "~/mongo/models/reminders"
import { tags } from "~/mongo/models/tags"

interface DatabaseConfig {
  autoIndex?: boolean
  debug?: boolean
}

class Database implements Disposable {
  #options: DatabaseConfig

  readonly afks = afks
  readonly configs = configs
  readonly giveaways = giveaways
  readonly guilds = guilds
  readonly joinToCreates = joinToCreates
  readonly levels = levels
  readonly otps = otps
  readonly reminders = reminders
  readonly tags = tags

  constructor(config?: DatabaseConfig) {
    this.#options = config ?? {}
  }

  async connect(uri: string) {
    this.#debug("Initialising database")

    if (connection.readyState === ConnectionStates.connected) {
      this.#debug("Reusing existing connection to MongoDB")
      return this
    }

    this.#debug("Connecting to MongoDB")

    try {
      await connect(uri, {
        autoIndex: this.#options.autoIndex,
      })
      this.#debug("Connected to MongoDB")
    } catch (error) {
      this.#debug(`Failed to connect to MongoDB: ${error as Error}`)
      throw error
    }

    return this
  }

  async disconnect() {
    try {
      await disconnect()
      this.#debug("Disconnected from MongoDB")
    } catch (error) {
      this.#debug(`Failed to disconnect from MongoDB: ${error as Error}`)
      throw error
    }

    return this
  }

  #debug(message: string) {
    if (!this.#options.debug) return
    console.debug(message)
  }

  [Symbol.dispose]() {
    void this.disconnect()
  }
}

export { Database }

export type * from "~/mongo/models/afks"
export type * from "~/mongo/models/analytics"
export type * from "~/mongo/models/configs"
export type * from "~/mongo/models/giveaways"
export type * from "~/mongo/models/guilds"
export type * from "~/mongo/models/join-to-creates"
export type * from "~/mongo/models/levels"
export type * from "~/mongo/models/otps"
export type * from "~/mongo/models/reminders"
export type * from "~/mongo/models/tags"
