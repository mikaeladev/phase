import { BaseBotStore } from "@phasejs/stores"

import { db } from "~/lib/db"

import type { Config, mongo } from "~/types/db"

export class ConfigStore extends BaseBotStore implements Config {
  public readonly status!: Config["status"]
  public readonly blacklist!: Config["blacklist"]
  public readonly killswitch!: Config["killswitch"]

  public async init() {
    const configDoc = (await db.configs.findOne({}))!
    const configObj = configDoc.toObject()

    Reflect.set(this, "status", configObj.status)
    Reflect.set(this, "blacklist", configObj.blacklist)
    Reflect.set(this, "killswitch", configObj.killswitch)

    db.configs
      .watch([], { fullDocument: "updateLookup" })
      .on("change", (change: mongo.ChangeStreamDocument<typeof configObj>) => {
        if (!("documentKey" in change)) return

        if (change.operationType === "delete") {
          throw new Error("Not implemented")
        } else {
          const fullDocument = change.fullDocument!
          Reflect.set(this, "config", fullDocument)
        }
      })

    return this
  }
}
