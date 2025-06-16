import { z } from "@repo/zod"

import { ms } from "~/ms"
import { moduleSchema, moduleSchemaExport } from "./_utils"

const baseSchema = moduleSchema({
  time: z
    .string()
    .nonempty("Time is required")
    .max(100, "Time cannot be longer than 100 characters")
    .refine(ms, "Invalid time format"),
  initialMessage: z
    .string()
    .nonempty("Initial message is required")
    .max(2000, "Initial message cannot be longer than 2000 characters"),
  reminderMessage: z
    .string()
    .nonempty("Reminder message is required")
    .max(2000, "Reminder message cannot be longer than 2000 characters"),
  mention: z.string().mention().optional(),
})

const transformedSchema = z.object({
  ...baseSchema.shape,
  time: z.number(),
})

function transform({
  time,
  ...data
}: z.TypeOf<typeof baseSchema>): z.TypeOf<typeof transformedSchema> {
  return {
    ...data,
    time: ms(time)!,
  }
}

export const bumpReminders = moduleSchemaExport(
  baseSchema,
  transformedSchema,
  transform,
)
