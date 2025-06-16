import { z } from "@repo/zod"

import { moduleSchema, moduleSchemaExport } from "./_utils"

const baseSchema = moduleSchema({
  counters: z
    .object({
      // name: z.string().nonempty("Name is required"),
      channel: z.string().snowflake("Channel is required"),
      content: z
        .string()
        .nonempty("Content is required")
        .max(100, "Content cannot be longer than 100 characters"),
    })
    .array()
    .max(10),
})

export const counters = moduleSchemaExport(baseSchema)
