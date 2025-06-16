import { z } from "@repo/zod"

import { moduleSchema, moduleSchemaExport } from "./_utils"

const baseSchema = moduleSchema({
  streamers: z
    .object({
      username: z
        .string()
        .min(4, "Username must be at least 4 characters")
        .max(25, "Username must be less than 25 characters"),
      channel: z.string().snowflake("You must select a channel"),
      mention: z.string().mention().optional(),
    })
    .array()
    .max(5),
})

export const twitchNotifications = moduleSchemaExport(baseSchema)
