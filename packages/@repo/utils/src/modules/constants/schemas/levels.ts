import { z } from "@repo/zod"

import { moduleSchema, moduleSchemaExport } from "./_utils"

const replyTypeSchema = z.enum(["reply", "dm", "channel"])

const baseSchema = moduleSchema({
  replyType: replyTypeSchema,
  channel: z
    .string()
    .snowflake()
    .or(replyTypeSchema.exclude(["channel"]))
    .optional(),
  message: z
    .string()
    .nonempty("Message is required")
    .max(2000, "Message cannot be longer than 2000 characters"),
  background: z
    .string()
    .url()
    .max(256, "Background URL cannot be longer than 256 characters")
    .optional()
    .transform((str) => str ?? undefined),
  mention: z.boolean(),
  roles: z
    .object({
      level: z.number().int().min(1).max(1000),
      role: z.string().snowflake("Role is required"),
    })
    .array()
    .max(100),
})

const transformedSchema = z.object({
  ...baseSchema.shape,
  channel: z
    .string()
    .snowflake()
    .or(replyTypeSchema.exclude(["channel"])),
  replyType: z.undefined(),
})

function transform({
  channel,
  replyType,
  ...data
}: z.TypeOf<typeof baseSchema>): z.TypeOf<typeof transformedSchema> {
  return {
    ...data,
    channel: replyType === "channel" ? channel! : replyType,
  }
}

export const levels = moduleSchemaExport(
  baseSchema,
  transformedSchema,
  transform,
)
