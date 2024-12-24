import type { Database } from "@repo/db"
import type { getEnv } from "@repo/env"
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"
import type { DjsClient } from "~/types/bot"

interface CreateContextParams extends FetchCreateContextFnOptions {
  client: DjsClient
  db: Database
  env: ReturnType<typeof getEnv<"bot">>
}

export function createContext(params: CreateContextParams) {
  const headers = params.req.headers

  const authorization = headers.get("Authorization") ?? ""
  const [prefix, token] = authorization.split(" ")

  const isAuthorized = prefix === "Secret" && token === params.env.BRIDGE_TOKEN

  return {
    client: params.client,
    db: params.db,
    env: params.env,
    isAuthorized,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
