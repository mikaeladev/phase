import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

import { nextBaseOptions } from "~/lib/constants"

import { authjs } from "~/presets/authjs"
import { base } from "~/presets/base"
import { discord } from "~/presets/discord"
import { trpcClient } from "~/presets/trpc"

export function www() {
  return createEnv({
    ...nextBaseOptions,
    extends: [
      base(nextBaseOptions),
      trpcClient(nextBaseOptions),
      discord(nextBaseOptions),
      authjs(nextBaseOptions),
    ],
    server: {
      DASH_URL: z.string().url(),
      DOCS_URL: z.string().url(),
    },
    client: {
      NEXT_PUBLIC_BASE_URL: z.string().url(),
    },
  })
}
