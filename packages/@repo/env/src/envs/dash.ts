import { createEnv } from "@t3-oss/env-core"

import { baseOptions } from "~/lib/constants"

import { base } from "~/envs/base"
import { authjs } from "~/presets/authjs"
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
  })
}