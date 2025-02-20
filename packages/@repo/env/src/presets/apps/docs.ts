import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

import { astroBaseOptions } from "~/lib/constants"

import { base } from "~/presets/base"

export function docs() {
  return createEnv({
    ...astroBaseOptions,
    extends: [base(astroBaseOptions)],
    server: {
      PORT: z.union([z.string().transform((v) => parseInt(v)), z.number()]),
    },
    client: {
      PUBLIC_BASE_URL: z.string().url(),
    },
  })
}
