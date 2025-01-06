import { trpc } from "@repo/env"
import { createTRPCClient, httpBatchLink } from "@trpc/client"

import type { AppRouter } from "~/server/router"

export const env = trpc("client")

export const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: env.TRPC_URL,
      headers: {
        Authorization: `Secret ${env.TRPC_TOKEN}`,
      },
    }),
  ],
})
