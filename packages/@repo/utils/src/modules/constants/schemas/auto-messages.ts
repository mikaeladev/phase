import { z } from "@repo/zod"

import { ms } from "~/ms"
import { moduleSchema, moduleSchemaExport } from "./_utils"

const baseSchema = moduleSchema({
  messages: z
    .object({
      name: z
        .string()
        .nonempty("Name is required")
        .max(100, "Name cannot be longer than 100 characters"),
      channel: z.string().snowflake("Channel is required"),
      content: z
        .string()
        .nonempty("Content is required")
        .max(2000, "Content cannot be longer than 2000 characters"),
      mention: z.string().mention().optional(),
      interval: z
        .string()
        .nonempty("Interval is required")
        .max(100, "Interval cannot be longer than 100 characters")
        .refine(ms, "Invalid interval format"),
    })
    .array()
    .max(10),
})

const transformedSchema = z.object({
  ...baseSchema.shape,
  messages: z
    .object({
      ...baseSchema.shape.messages.element.shape,
      content: z.undefined(),
      message: z.string(),
      interval: z.number(),
    })
    .array()
    .max(10),
})

function transform({
  messages,
  ...data
}: z.TypeOf<typeof baseSchema>): z.TypeOf<typeof transformedSchema> {
  return {
    ...data,
    messages: messages.map(({ content, interval, ...message }) => ({
      ...message,
      message: content,
      interval: ms(interval)!,
    })),
  }
}

export const autoMessages = moduleSchemaExport(
  baseSchema,
  transformedSchema,
  transform,
)
