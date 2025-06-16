import { z } from "@repo/zod"

import { moduleSchema, moduleSchemaExport } from "./_utils"

const baseSchema = moduleSchema({
  channel: z.string().snowflake("Channel is required"),
  category: z.string().snowflake("Category is required"),
})

export const joinToCreates = moduleSchemaExport(baseSchema)
