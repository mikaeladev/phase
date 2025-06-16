import { z } from "@repo/zod"

import { moduleSchema, moduleSchemaExport } from "./_utils"

const baseSchema = moduleSchema({
  warnings: z
    .object({ role: z.string().snowflake("Role is required") })
    .array()
    .max(10),
})

const transformedSchema = z.object({
  ...baseSchema.shape,
  warnings: z.string().array().max(10),
})

function transform({
  warnings,
  ...data
}: z.TypeOf<typeof baseSchema>): z.TypeOf<typeof transformedSchema> {
  return {
    ...data,
    warnings: warnings.map(({ role }) => role),
  }
}

export const warnings = moduleSchemaExport(
  baseSchema,
  transformedSchema,
  transform,
)
