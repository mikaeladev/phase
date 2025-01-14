import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

import { baseOptions } from "~/lib/constants"

export function trpc(type: "client"): Readonly<{
  TRPC_URL: string
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
        TRPC_URL: z.string().url(),
        TRPC_TOKEN: z.string().base64().max(44),
      },
    })
  }

  if (type === "server") {
    return createEnv({
      ...baseOptions,
      server: {
        TRPC_PORT: z.string().transform(Number),
        TRPC_TOKEN: z.string().base64().max(44),
      },
    })
  }

  throw new Error("Invalid type")
}
