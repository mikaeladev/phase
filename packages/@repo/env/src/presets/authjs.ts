import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

import { baseOptions } from "~/lib/constants"

export function authjs() {
  return createEnv({
    ...baseOptions,
    server: {
      AUTH_COOKIE_SECRET: z.string().base64().max(44),
      AUTH_OTP_SECRET: z.string().base64().max(44),
    },
  })
}
