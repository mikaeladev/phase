import { createTRPCClient, httpBatchLink } from "@trpc/client"

import type { AppRouter } from "~/server/router"

export interface ClientConfig {
  url: string
  auth: {
    token: string
    adminId?: string
    guildId?: string
  }
}

export function createClient(config: ClientConfig) {
  const headers = new Headers()

  headers.set("Authorization", `Secret ${config.auth.token}`)

  if (config.auth.adminId) headers.set("X-Admin-ID", config.auth.adminId)
  if (config.auth.guildId) headers.set("X-Guild-ID", config.auth.guildId)

  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: config.url,
        headers,
      }),
    ],
  })
}

export { isTRPCClientError } from "@trpc/client"
export type { TRPCClientError } from "@trpc/client"
export type * from "~/types/trpc"
