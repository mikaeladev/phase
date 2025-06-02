import { createEnv } from "@t3-oss/env-core"
import { z } from "@repo/zod"

import type { BaseOptions } from "~/lib/constants"

export function authjs(baseOptions: BaseOptions) {
  return createEnv({
    ...baseOptions,
    server: {
      AUTH_COOKIE_SECRET: z.string().base64().max(44),
      AUTH_OTP_SECRET: z.string().base64().max(44),
    },
  })
}
