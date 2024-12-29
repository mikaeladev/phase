import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

import { baseOptions } from "~/lib/constants"

export function discord() {
  return createEnv({
    ...baseOptions,
    server: {
      DISCORD_TOKEN: z.string(),
      DISCORD_SECRET: z.string(),
      DISCORD_ID: z.string(),
    },
  })
}
