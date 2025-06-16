import { z } from "@repo/zod"

import { moduleSchema, moduleSchemaExport } from "./_utils"

const sharedMethodFields = z.object({
  id: z.string().uuid(),
  type: z.string(),
  name: z
    .string()
    .nonempty("Name is required")
    .max(256, "Maximum of 256 characters allowed"),
  content: z
    .string()
    .nonempty("Content is required")
    .max(512, "Maximum of 512 characters allowed"),
  channel: z.string().snowflake("Channel is required"),
  multiselect: z.boolean().default(false),
})

const sharedMethodMethodFields = z.object({
  id: z.string().uuid(),
  emoji: z.string().emoji().optional(),
  label: z
    .string()
    .nonempty("Label is required")
    .max(80, "Maximum of 80 characters allowed"),
  rolesToAdd: z
    .string()
    .array()
    .max(10, "Maximum of 10 roles allowed")
    .default([]),
  rolesToRemove: z
    .string()
    .array()
    .max(10, "Maximum of 10 roles allowed")
    .default([]),
})

const baseSchema = moduleSchema({
  messages: z
    .union([
      z.object({
        ...sharedMethodFields.shape,
        type: z.literal("reaction"),
        methods: z
          .object({
            ...sharedMethodMethodFields.shape,
            emoji: z.string().emoji(),
            label: z.undefined(),
          })
          .array()
          .min(1, "At least one method is required")
          .max(20, "Maximum of 20 methods allowed"),
      }),
      z.object({
        ...sharedMethodFields.shape,
        type: z.literal("button"),
        methods: z
          .object(sharedMethodMethodFields.shape)
          .array()
          .min(1, "At least one method is required")
          .max(20, "Maximum of 20 methods allowed"),
      }),
      z.object({
        ...sharedMethodFields.shape,
        type: z.literal("dropdown"),
        methods: z
          .object(sharedMethodMethodFields.shape)
          .array()
          .min(1, "At least one method is required")
          .max(20, "Maximum of 20 methods allowed"),
      }),
    ])
    .array()
    .min(1)
    .max(10, "Maximum of 10 messages allowed"),
})

const transformedSchema = z.object({
  ...baseSchema.shape,
  messages: z
    .union([
      z.object({
        ...baseSchema.shape.messages.element.options[0].shape,
        methods: z
          .object({
            ...baseSchema.shape.messages.element.options[0].shape.methods
              .element.shape,
            rolesToAdd: z.undefined(),
            rolesToRemove: z.undefined(),
            roles: z
              .object({
                id: z.string().snowflake(),
                action: z.enum(["add", "remove"]),
              })
              .array(),
          })
          .array()
          .min(1)
          .max(20),
      }),
      z.object({
        ...baseSchema.shape.messages.element.options[1].shape,
        methods: z
          .object({
            ...baseSchema.shape.messages.element.options[1].shape.methods
              .element.shape,
            rolesToAdd: z.undefined(),
            rolesToRemove: z.undefined(),
            roles: z
              .object({
                id: z.string().snowflake(),
                action: z.enum(["add", "remove"]),
              })
              .array(),
          })
          .array()
          .min(1)
          .max(20),
      }),
      z.object({
        ...baseSchema.shape.messages.element.options[2].shape,
        methods: z
          .object({
            ...baseSchema.shape.messages.element.options[2].shape.methods
              .element.shape,
            rolesToAdd: z.undefined(),
            rolesToRemove: z.undefined(),
            roles: z
              .object({
                id: z.string().snowflake(),
                action: z.enum(["add", "remove"]),
              })
              .array(),
          })
          .array()
          .min(1)
          .max(20),
      }),
    ])
    .array()
    .min(1)
    .max(10),
})

function transform({
  messages,
  ...data
}: z.TypeOf<typeof baseSchema>): z.TypeOf<typeof transformedSchema> {
  return {
    ...data,
    messages: messages.map((message) => {
      // reaction messages dont have the label field so typescript gets upset
      if (message.type === "reaction") {
        return {
          ...message,
          methods: message.methods.map(
            ({ rolesToAdd, rolesToRemove, ...method }) => ({
              ...method,
              roles: [
                ...rolesToAdd.map((id) => ({ id, action: "add" as const })),
                ...rolesToRemove.map((id) => ({
                  id,
                  action: "remove" as const,
                })),
              ],
            }),
          ),
        }
      }

      return {
        ...message,
        methods: message.methods.map(
          ({ rolesToAdd, rolesToRemove, ...method }) => ({
            ...method,
            roles: [
              ...rolesToAdd.map((id) => ({ id, action: "add" as const })),
              ...rolesToRemove.map((id) => ({ id, action: "remove" as const })),
            ],
          }),
        ),
      }
    }),
  }
}

export const selfRoles = moduleSchemaExport(
  baseSchema,
  transformedSchema,
  transform,
)
