import { createClient as _createClient } from "@repo/trpc/client"

import { env } from "~/lib/env"

export type TRPCClient = ReturnType<typeof createClient>

export function createClient(auth: { adminId?: string; guildId?: string }) {
  return _createClient({
    url: env.TRPC_URL,
    auth: {
      token: env.TRPC_TOKEN,
      adminId: auth.adminId,
      guildId: auth.guildId,
    },
  })
}
