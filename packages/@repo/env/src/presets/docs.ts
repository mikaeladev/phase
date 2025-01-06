import { createEnv } from "@t3-oss/env-core"

import { baseOptions } from "~/lib/constants"

import { base } from "~/presets/base"

export function docs() {
  return createEnv({
    ...baseOptions,
    extends: [base("vercel")],
  })
}
