import { z } from "@repo/zod"

import { moduleSchema, moduleSchemaExport } from "./_utils"

const baseSchema = moduleSchema({
  channel: z.string().snowflake("Channel is required"),
  forms: z
    .object({
      id: z.string().uuid(),
      name: z
        .string()
        .nonempty("Name is required")
        .max(32, "Name cannot be longer than 32 characters"),
      channel: z.string().snowflake("Channel is required"),
      questions: z
        .object({
          label: z
            .string()
            .nonempty("Question is required")
            .max(128, "Question cannot be longer than 128 characters"),
          type: z.enum(["string", "number", "boolean"]),
          required: z.boolean(),
          choices: z
            .string()
            .nonempty("Choice is required")
            .max(100, "Choice cannot be longer than 100 characters")
            .array()
            .max(10)
            .transform((arr) => (arr.length === 0 ? undefined : arr))
            .optional(),
          min: z.number().min(0).max(1024).optional(),
          max: z.number().min(0).max(1024).optional(),
        })
        .array()
        .min(1)
        .max(25),
    })
    .array()
    .max(10),
})

export const forms = moduleSchemaExport(baseSchema)
