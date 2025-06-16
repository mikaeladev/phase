import { z } from "@repo/zod"

import { moduleSchema, moduleSchemaExport } from "./_utils"

const baseSchema = moduleSchema({
  messageUrl: z
    .string()
    .regex(
      /^https:\/\/discord\.com\/channels\/\d+\/\d+\/\d+$/,
      "URL does not match the Discord message URL pattern",
    ),
  reactions: z
    .object({
      emoji: z.string().nonempty("Emoji is required").emoji(),
      role: z.string().snowflake("Role is required"),
    })
    .array()
    .max(20),
})

const transformedSchema = z.object({
  ...baseSchema.shape,
  messageUrl: z.undefined(),
  channel: z.string().snowflake(),
  message: z.string(),
})

function transform({
  messageUrl,
  ...data
}: z.TypeOf<typeof baseSchema>): z.TypeOf<typeof transformedSchema> {
  const [, channelId, messageId] = messageUrl
    .replace("https://discord.com/channels/", "")
    .split("/") as [string, string, string]

  return {
    ...data,
    channel: channelId,
    message: messageId,
  }
}

export const reactionRoles = moduleSchemaExport(
  baseSchema,
  transformedSchema,
  transform,
)
