import { createEnv } from "@t3-oss/env-core"

import { baseOptions } from "~/lib/constants"

import { base } from "~/envs/base"
import { authjs } from "~/presets/authjs"
import { discord } from "~/presets/discord"
import { trpc } from "~/presets/trpc"
import { z } from "zod"

export function www() {
  return createEnv({
    ...baseOptions,
    extends: [base("vercel"), trpc("client"), discord(), authjs()],
    server: {
      DASH_DOMAIN: z.string().url(),
      DOCS_DOMAIN: z.string().url(),
    }
  })
}
