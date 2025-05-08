import type { BotStores } from "~/index"
import type { BotStore } from "~/types/stores"

import type {} from "discord.js"
import type {} from "@phasejs/core"

declare module "discord.js" {
  interface Client {
    /** @deprecated Access from `phase.stores` instead */
    stores: BotStores
  }
}

declare module "@phasejs/core" {
  interface BotClient {
    stores: BotStores
  }

  interface BotClientEvents {
    storeInit: BotStore
  }
}
