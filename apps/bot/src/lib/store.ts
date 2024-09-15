import { Collection } from "discord.js"

import { db } from "~/lib/db"

import type { Config, Guild, mongoose } from "~/lib/db"
import type { Client, Snowflake } from "discord.js"

export function storePlugin(client: Client<false>) {
  client.store = new Store()
  return client
}

type WithId<T> = T & { _id: mongoose.Types.ObjectId }

export class Store {
  readonly config!: Config
  readonly guilds = new Collection<Snowflake, WithId<Guild>>()
  readonly twitchStatuses = new Collection<string, boolean>()

  async init() {
    await this.getConfig()
    await this.getGuilds()
  }

  private async getConfig() {
    const configDoc = (await db.configs.findOne({}))!
    const configObj = configDoc.toObject()

    Reflect.set(this, "config", configObj)

    db.configs
      .watch([], { fullDocument: "updateLookup" })
      .on(
        "change",
        async (
          change: mongoose.mongo.ChangeStreamDocument<typeof configObj>,
        ) => {
          if (!("documentKey" in change)) return

          if (change.operationType === "delete") {
            throw new Error("Not implemented")
          } else {
            const fullDocument = change.fullDocument!
            Reflect.set(this, "config", fullDocument)
          }
        },
      )
  }

  private async getGuilds() {
    const guildDocs = await db.guilds.find({})
    const guildObjs = guildDocs.map((doc) => doc.toObject())

    Reflect.set(
      this,
      "guilds",
      new Collection(guildObjs.map((guild) => [guild.id, guild])),
    )

    type GuildObject = (typeof guildObjs)[number]
    type GuildChangeStreamDoc = mongoose.mongo.ChangeStreamDocument<GuildObject>

    db.guilds
      .watch([], { fullDocument: "updateLookup" })
      .on("change", async (change: GuildChangeStreamDoc) => {
        if (!("documentKey" in change)) return

        if (change.operationType === "delete") {
          const guildId =
            change.fullDocumentBeforeChange?.id ??
            this.guilds.find(
              (guildDoc) =>
                guildDoc._id.toString() === change.documentKey._id.toString(),
            )?.id

          if (guildId) this.guilds.delete(guildId)
        } else {
          const fullDocument = change.fullDocument!
          const guildId = fullDocument.id
          this.guilds.set(guildId, fullDocument)
        }
      })
  }
}