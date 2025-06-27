import { z } from "@repo/zod"
import { createEnv } from "@t3-oss/env-core"

import type { BaseOptions } from "~/lib/constants"

export function trpcClient(baseOptions: BaseOptions) {
  return createEnv({
    ...baseOptions,
    server: {
      TRPC_URL: z.string().url(),
      TRPC_TOKEN: z.string().base64().max(44),
    },
  })
}

export function trpcServer(baseOptions: BaseOptions) {
  return createEnv({
    ...baseOptions,
    server: {
      TRPC_PORT: z.string().transform(Number),
      TRPC_TOKEN: z.string().base64().max(44),
    },
  })
}
