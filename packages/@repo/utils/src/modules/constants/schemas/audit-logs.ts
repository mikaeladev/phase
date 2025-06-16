import { z } from "@repo/zod"

import { moduleSchema, moduleSchemaExport } from "./_utils"

const baseSchema = moduleSchema({
  channels: z.object({
    server: z.string().snowflake().optional(),
    messages: z.string().snowflake().optional(),
    voice: z.string().snowflake().optional(),
    invites: z.string().snowflake().optional(),
    members: z.string().snowflake().optional(),
    punishments: z.string().snowflake().optional(),
  }),
})

export const auditLogs = moduleSchemaExport(baseSchema)
