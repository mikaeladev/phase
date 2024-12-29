import { BotPlugin } from "@phasejs/core/client"

import { bot } from "@repo/env"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

import { createContext } from "~/server/context"
import { appRouter } from "~/server/router"
import { version } from "../../package.json"

import type { BotPluginVersion } from "@phasejs/core"
import type { Database } from "@repo/db"
import type { DjsClient } from "~/types/bot"

export interface BridgeServerPluginConfig {
  db: Database
}

export function bridgeServerPlugin(config: BridgeServerPluginConfig) {
  return new BotPlugin({
    name: "BridgeServer",
    trigger: "ready",
    version: version as BotPluginVersion,
    onLoad: (phase) => {
      const env = bot()

      Bun.serve({
        port: env.TRPC_PORT,
        fetch(request) {
          return fetchRequestHandler({
            endpoint: "/",
            req: request,
            router: appRouter,
            createContext: (opts) =>
              createContext({
                ...opts,
                db: config.db,
                client: phase.client as DjsClient<true>,
                env,
              }),
          })
        },
      })
    },
  })
}
