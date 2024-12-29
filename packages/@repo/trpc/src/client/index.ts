import { www } from "@repo/env"
import { createTRPCClient, httpBatchLink } from "@trpc/client"

import type { AppRouter } from "~/server/router"

export const env = www()

export const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: env.TRPC_DOMAIN,
      headers: {
        Authorization: `Secret ${env.TRPC_TOKEN}`,
      },
    }),
  ],
})
