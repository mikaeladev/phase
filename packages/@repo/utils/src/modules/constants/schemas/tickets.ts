import { z } from "@repo/zod"

import { moduleSchema, moduleSchemaExport } from "./_utils"

const baseSchema = moduleSchema({
  channel: z.string().snowflake("Channel is required"),
  category: z.string().snowflake().optional(),
  message: z
    .string()
    .max(1000, "Message must be less than 1000 characters")
    .trim()
    .optional(),
  max_open: z.number().int().optional(),
  tickets: z
    .object({
      id: z.string().uuid(),
      name: z
        .string()
        .nonempty("Name is required")
        .max(32, "Name cannot be longer than 32 characters"),
      message: z
        .string()
        .nonempty("Message is required")
        .max(1000, "Message must be less than 1000 characters"),
      mention: z.string().snowflake().optional(),
      reason: z
        .enum(["required", "optional", "disabled"])
        .default("disabled")
        .optional(),
    })
    .array()
    .max(5),
})

export const tickets = moduleSchemaExport(baseSchema)
