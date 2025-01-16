import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

import type { BaseOptions } from "~/lib/constants"

export function database(baseOptions: BaseOptions) {
  return createEnv({
    ...baseOptions,
    server: {
      MONGODB_URI: z.string(),
      POSTGRES_URI: z.string(),
    },
  })
}
