import { z } from "@repo/zod"
import { createEnv } from "@t3-oss/env-core"

import { astroBaseOptions } from "~/lib/constants"

import { base } from "~/presets/base"

export function docs() {
  return createEnv({
    ...astroBaseOptions,
    extends: [base(astroBaseOptions)],
    client: {
      PUBLIC_BASE_URL: z.string().url(),
    },
  })
}
