import { createEnv } from "@t3-oss/env-core"

import { baseOptions } from "~/lib/constants"

import { base } from "~/envs/base"
import { authjs } from "~/presets/authjs"
import { discord } from "~/presets/discord"

export function www() {
  return createEnv({
    ...baseOptions,
    extends: [base("vercel"), discord(), authjs()],
  })
}
