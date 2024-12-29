import { createEnv } from "@t3-oss/env-core"

import { baseOptions } from "~/lib/constants"

import { base } from "~/envs/base"

export function docs() {
  return createEnv({
    ...baseOptions,
    extends: [base("vercel")],
  })
}
