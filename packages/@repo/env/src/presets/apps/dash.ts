import { createEnv } from "@t3-oss/env-core"
import { z } from "@repo/zod"

import { nextBaseOptions } from "~/lib/constants"

import { authjs } from "~/presets/authjs"
import { base } from "~/presets/base"
import { database } from "~/presets/database"
import { discord } from "~/presets/discord"
import { trpcClient } from "~/presets/trpc"
import { twitch } from "~/presets/twitch"

export function dash() {
  return createEnv({
    ...nextBaseOptions,
    extends: [
      base(nextBaseOptions),
      trpcClient(nextBaseOptions),
      database(nextBaseOptions),
      discord(nextBaseOptions),
      twitch(nextBaseOptions),
      authjs(nextBaseOptions),
    ],
    client: {
      NEXT_PUBLIC_BASE_URL: z.string().url(),
    },
  })
}
