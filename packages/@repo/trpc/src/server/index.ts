import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

import { createContext } from "~/server/context"
import { appRouter } from "~/server/router"

import type { Database } from "@repo/db"
import type { bot } from "@repo/env"
import type { DjsClient } from "~/types/bot"

export interface RequestHandlerConfig {
  db: Database
  env: ReturnType<typeof bot>
  client: DjsClient
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
