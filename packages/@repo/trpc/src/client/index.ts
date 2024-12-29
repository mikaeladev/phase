import { www } from "@repo/env"
import { createTRPCClient, httpBatchLink } from "@trpc/client"

import type { AppRouter } from "~/server/router"

export const env = www()

export const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: env.BRIDGE_DOMAIN,
      headers: {
        Authorization: `Secret ${env.BRIDGE_TOKEN}`,
      },
    }),
  ],
})
