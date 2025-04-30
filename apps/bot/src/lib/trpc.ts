import { BotPlugin } from "@phasejs/core"

import { createRequestHandler } from "@repo/trpc/server"

import { db } from "~/lib/db"
import { env } from "~/lib/env"

export function trpcPlugin() {
  return new BotPlugin({
    name: "TRPC",
    trigger: "ready",
    version: "0.0.0",
    onLoad(phase) {
      Bun.serve({
        port: env.TRPC_PORT,
        fetch(req) {
          return createRequestHandler(req, { db, env, phase })
        },
      })
    },
  })
}
