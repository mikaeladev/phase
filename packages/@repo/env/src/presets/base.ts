import { createEnv } from "@t3-oss/env-core"
import { railway, vercel } from "@t3-oss/env-core/presets"
import { z } from "zod"

import { baseOptions, runtimeEnv } from "~/lib/constants"

const baseURL =
  runtimeEnv.BASE_URL ??
  runtimeEnv.PUBLIC_BASE_URL ??
  runtimeEnv.NEXT_PUBLIC_BASE_URL

type BaseVariables<TExtends extends Readonly<Record<string, unknown>> = {}> =
  Readonly<{
    BASE_URL: string
    NODE_ENV: "development" | "production"
    SKIP_ENV_VALIDATION: boolean
  }> &
    TExtends

export function base(): BaseVariables
export function base(host: "vercel"): BaseVariables<ReturnType<typeof vercel>>
export function base(host: "railway"): BaseVariables<ReturnType<typeof railway>>

export function base(host?: "railway" | "vercel") {
  const extendsArr =
    host === "railway"
      ? [railway()]
      : host === "vercel"
        ? [vercel()]
        : undefined

  return createEnv({
    ...baseOptions,
    extends: extendsArr,
    server: {},
    shared: {
      BASE_URL: z.string().url().default(baseURL!),
      NODE_ENV: z.enum(["development", "production"]).default("development"),
      SKIP_ENV_VALIDATION: z.boolean().optional(),
    },
  })
}
