import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

import { createContext } from "~/server/context"
import { appRouter } from "~/server/router"

import type { Database } from "@repo/db"
import type { bot } from "@repo/env"
import type { BotClientWithStores } from "~/types/bot"

export interface RequestHandlerConfig {
  db: Database
  env: ReturnType<typeof bot>
  phase: BotClientWithStores
}

export function createRequestHandler(
  request: Request,
  config: RequestHandlerConfig,
) {
  return fetchRequestHandler({
    endpoint: "/",
    req: request,
    router: appRouter,
    createContext: (opts) =>
      createContext({
        ...opts,
        ...config,
      }),
  })
}
