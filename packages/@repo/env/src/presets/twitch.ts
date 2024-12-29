import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

import { baseOptions } from "~/lib/constants"

export function twitch() {
  return createEnv({
    ...baseOptions,
    server: {
      TWITCH_CLIENT_SECRET: z.string(),
      TWITCH_CLIENT_ID: z.string(),
    },
  })
}
