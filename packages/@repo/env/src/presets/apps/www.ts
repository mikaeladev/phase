import { z } from "@repo/zod"
import { createEnv } from "@t3-oss/env-core"

import { nextBaseOptions } from "~/lib/constants"

import { base } from "~/presets/base"
import { trpcClient } from "~/presets/trpc"

export function www() {
  return createEnv({
    ...nextBaseOptions,
    extends: [base(nextBaseOptions), trpcClient(nextBaseOptions)],
    server: {
      DASH_URL: z.string().url(),
      DOCS_URL: z.string().url(),
    },
    client: {
      NEXT_PUBLIC_BASE_URL: z.string().url(),
    },
  })
}
