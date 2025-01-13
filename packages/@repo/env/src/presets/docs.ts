import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

import { baseOptions } from "~/lib/constants"

import { base } from "~/presets/base"

export function docs() {
  return createEnv({
    ...baseOptions,
    extends: [base("vercel")],
    clientPrefix: "PUBLIC_",
    client: {
      PUBLIC_BASE_URL: z.string().url(),
    },
  })
}
