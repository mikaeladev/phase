import { BotPlugin } from "@phasejs/core/client"

import { getEnv } from "@repo/env"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

import { version } from "~/../package.json"
import { createContext } from "~/server/context"
import { appRouter } from "~/server/router"

import type { BotPluginVersion } from "@phasejs/core"
import type { Database } from "@repo/db"
import type { DjsClient } from "~/types/bot"

export function startServer({
  client,
  db,
}: {
  client: DjsClient<true>
  db: Database
}) {
  const env = getEnv("bot")

  return Bun.serve({
    port: env.BRIDGE_PORT,
    fetch(request) {
      return fetchRequestHandler({
        endpoint: "/",
        req: request,
        router: appRouter,
        createContext: (opts) => createContext({ ...opts, client, db, env }),
      })
    },
  })
}

export function bridgeServerPlugin({ db }: { db: Database }) {
  return new BotPlugin({
    name: "BridgeServer",
    trigger: "ready",
    version: version as BotPluginVersion,
    onLoad: (phase) => {
      startServer({ client: phase.client as DjsClient<true>, db })
    },
  })
}
