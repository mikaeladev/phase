import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

import { baseOptions } from "~/lib/constants"

import { authjs } from "~/presets/authjs"
import { base } from "~/presets/base"
import { database } from "~/presets/database"
import { discord } from "~/presets/discord"
import { trpc } from "~/presets/trpc"
import { twitch } from "~/presets/twitch"

export function dash() {
  return createEnv({
    ...baseOptions,
    extends: [
      base("vercel"),
      trpc("client"),
      database(),
      discord(),
      twitch(),
      authjs(),
    ],
    client: {
      NEXT_PUBLIC_BASE_URL: z.string().url(),
    },
  })
}
