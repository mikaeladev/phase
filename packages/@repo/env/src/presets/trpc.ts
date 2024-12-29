import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

import { baseOptions } from "~/lib/constants"

export function trpc(type: "client"): Readonly<{
  BRIDGE_DOMAIN: string
  BRIDGE_TOKEN: string
}>

export function trpc(type: "server"): Readonly<{
  BRIDGE_PORT: number
  BRIDGE_TOKEN: string
}>

export function trpc(type: "client" | "server") {
  if (type === "client") {
    return createEnv({
      ...baseOptions,
      server: {
        BRIDGE_DOMAIN: z.string(),
        BRIDGE_TOKEN: z.string(),
      },
    })
  }

  if (type === "server") {
    return createEnv({
      ...baseOptions,
      server: {
        BRIDGE_PORT: z.string().transform(Number),
        BRIDGE_TOKEN: z.string(),
      },
    })
  }

  throw new Error("Invalid type")
}
