import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

import { baseOptions } from "~/lib/constants"

import { authjs } from "~/presets/authjs"
import { base } from "~/presets/base"
import { discord } from "~/presets/discord"
import { trpc } from "~/presets/trpc"

export function www() {
  return createEnv({
    ...baseOptions,
    extends: [base("vercel"), trpc("client"), discord(), authjs()],
    server: {
      DASH_URL: z.string().url(),
      DOCS_URL: z.string().url(),
    },
    clientPrefix: "NEXT_PUBLIC_",
    client: {
      NEXT_PUBLIC_BASE_URL: z.string().url(),
    },
  })
}
