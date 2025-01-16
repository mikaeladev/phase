import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

import type { BaseOptions } from "~/lib/constants"

export function twitch(baseOptions: BaseOptions) {
  return createEnv({
    ...baseOptions,
    server: {
      TWITCH_CLIENT_SECRET: z.string(),
      TWITCH_CLIENT_ID: z.string(),
    },
  })
}
