import { createEnv } from "@t3-oss/env-core"
import { z } from "@repo/zod"

import { botBaseOptions } from "~/lib/constants"

import { authjs } from "~/presets/authjs"
import { base } from "~/presets/base"
import { database } from "~/presets/database"
import { discord } from "~/presets/discord"
import { trpcServer } from "~/presets/trpc"
import { twitch } from "~/presets/twitch"

export function bot() {
  return createEnv({
    ...botBaseOptions,
    extends: [
      base(botBaseOptions),
      trpcServer(botBaseOptions),
      database(botBaseOptions),
      discord(botBaseOptions),
      twitch(botBaseOptions),
      authjs(botBaseOptions),
    ],
    server: {
      BASE_URL: z.string().url(),
      WEBHOOK_ALERT: z.string(),
    },
  })
}
