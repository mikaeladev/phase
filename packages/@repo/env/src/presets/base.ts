import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

import type { BaseOptions } from "~/lib/constants"

export function base(baseOptions: BaseOptions) {
  return createEnv({
    ...baseOptions,
    shared: {
      NODE_ENV: z.enum(["development", "production"]).default("development"),
      SKIP_ENV_VALIDATION: z.boolean().optional(),
    },
  })
}
