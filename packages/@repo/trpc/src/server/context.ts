import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"
import type { RequestHandlerConfig } from "~/server"

interface CreateContextParams
  extends FetchCreateContextFnOptions,
    RequestHandlerConfig {}

export function createContext(params: CreateContextParams) {
  const headers = params.req.headers

  const authorization = headers.get("Authorization") ?? ""
  const [prefix, token] = authorization.split(" ")

  const isAuthorized = prefix === "Secret" && token === params.env.TRPC_TOKEN

  return {
    db: params.db,
    env: params.env,
    phase: params.phase,
    isAuthorized,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
