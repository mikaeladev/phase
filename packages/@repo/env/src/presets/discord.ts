import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

import type { BaseOptions } from "~/lib/constants"

export function discord(baseOptions: BaseOptions) {
  return createEnv({
    ...baseOptions,
    server: {
      DISCORD_TOKEN: z.string(),
      DISCORD_SECRET: z.string(),
      DISCORD_ID: z.string(),
    },
  })
}
