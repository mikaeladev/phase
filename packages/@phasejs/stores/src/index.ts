import { BotPlugin } from "@phasejs/core"

import type { BotClient } from "@phasejs/core"
import type { BotStore } from "~/types/stores"

import "~/types/declarations/client"

export interface BotStores extends Record<string, BotStore> {}

export interface StoresPluginOptions {
  stores: {
    [K in keyof BotStores]: new (phase: BotClient) => BotStores[K]
  }
}

export function storesPlugin(options: StoresPluginOptions) {
  return new BotPlugin({
    name: "stores",
    trigger: "startup",
    version: "0.1.0",
    async onLoad(phase) {
      const stores = Object.entries(options.stores).reduce(
        (acc, [name, Store]) => {
          acc[name] = new Store(phase)
          return acc
        },
        {} as BotStores,
      )

      phase.stores = stores

      for (const store of Object.values(phase.stores)) {
        await store.init()
        void phase.emitter.emit("storeInit", store)
      }
    },
  })
}

export * from "~/structures/BaseBotKVStore"
export * from "~/structures/BaseBotStore"
