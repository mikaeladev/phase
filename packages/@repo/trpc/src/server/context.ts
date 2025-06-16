import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"
import type { RequestHandlerConfig } from "~/server"
import type { GuildDoc } from "~/types/bot"
import type { Guild as GuildAPI } from "discord.js"

interface CreateContextParams
  extends FetchCreateContextFnOptions,
    RequestHandlerConfig {}

export function createContext(params: CreateContextParams) {
  return {
    req: params.req,
    db: params.db,
    env: params.env,
    phase: params.phase,
  }
}

export type Context = ReturnType<typeof createContext>

export type ContextWithAdminAuth = Context & {
  auth: {
    adminId: string
  }
}

export type ContextWithGuildAuth = Context & {
  auth: {
    adminId: string
    guildId: string
    guildDoc: GuildDoc
    guildAPI: GuildAPI
  }
}

export type AnyContext = Context | ContextWithAdminAuth | ContextWithGuildAuth
