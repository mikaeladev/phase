import { z } from "@repo/zod"

import { moduleSchema, moduleSchemaExport } from "./_utils"

const baseSchema = moduleSchema({
  roles: z
    .object({
      id: z.string().snowflake("Role is required"),
      target: z.enum(["everyone", "members", "bots"]),
    })
    .array()
    .max(10),
})

export const autoRoles = moduleSchemaExport(baseSchema)
