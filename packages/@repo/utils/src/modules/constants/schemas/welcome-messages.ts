import { z } from "@repo/zod"

import { moduleSchema, moduleSchemaExport } from "./_utils"

const baseSchema = moduleSchema({
  channel: z.string().snowflake("Channel is required"),
  message: z
    .string()
    .nonempty("Message is required")
    .max(2000, "Message must be less than 2000 characters"),
  mention: z.boolean(),
  card: z.object({
    enabled: z.boolean(),
    background: z
      .string()
      .url()
      .max(256, "Background URL cannot be longer than 256 characters")
      .optional(),
  }),
})

export const welcomeMessages = moduleSchemaExport(baseSchema)
