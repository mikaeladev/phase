import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

import { baseOptions } from "~/lib/constants"

export function trpc(type: "client"): Readonly<{
  TRPC_DOMAIN: string
  TRPC_TOKEN: string
}>

export function trpc(type: "server"): Readonly<{
  TRPC_PORT: number
  TRPC_TOKEN: string
}>

export function trpc(type: "client" | "server") {
  if (type === "client") {
    return createEnv({
      ...baseOptions,
      server: {
        TRPC_DOMAIN: z.string(),
        TRPC_TOKEN: z.string(),
      },
    })
  }

  if (type === "server") {
    return createEnv({
      ...baseOptions,
      server: {
        TRPC_PORT: z.string().transform(Number),
        TRPC_TOKEN: z.string(),
      },
    })
  }

  throw new Error("Invalid type")
}
