import { BaseBotKVStore } from "@phasejs/stores"

import { db } from "~/lib/db"

import type { Guild, mongo, Types } from "~/types/db"
import type { Snowflake } from "discord.js"

type GuildDoc = Guild & { _id: Types.ObjectId }
type GuildChangeStreamDoc = mongo.ChangeStreamDocument<GuildDoc>

export class GuildStore extends BaseBotKVStore<Snowflake, GuildDoc> {
  public async init() {
    if (this._init) return this

    const guildIds = (await this.phase.client.guilds.fetch()).map(
      (guild) => guild.id,
    )

    const guildDocs = await db.guilds.find({ id: { $in: guildIds } })
    const guildObjs = guildDocs.map((doc) => doc.toObject())

    for (const guild of guildObjs) {
      this.set(guild.id, guild)
    }

    db.guilds
      .watch([], { fullDocument: "updateLookup" })
      .on("change", (change: GuildChangeStreamDoc) => {
        if (!("documentKey" in change)) return

        if (change.operationType === "delete") {
          const guildId =
            change.fullDocumentBeforeChange?.id ??
            this.values().find(
              (guildDoc) =>
                guildDoc._id.toString() === change.documentKey._id.toString(),
            )?.id

          if (guildId) this.delete(guildId)
        } else {
          const fullDocument = change.fullDocument!
          const guildId = fullDocument.id
          this.set(guildId, fullDocument)
        }
      })

    this._init = true
    return this
  }
}
