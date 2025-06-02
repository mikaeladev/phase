import { ModuleId } from "@repo/utils/modules"
import { ms } from "@repo/utils/ms"
import { z } from "@repo/zod"

function moduleSchema<T extends Record<string, Zod.ZodType>>(schema: T) {
  return z.object({ enabled: z.boolean(), ...schema })
}

export const auditLogsSchema = moduleSchema({
  channels: z.object({
    server: z.string().snowflake().optional(),
    messages: z.string().snowflake().optional(),
    voice: z.string().snowflake().optional(),
    invites: z.string().snowflake().optional(),
    members: z.string().snowflake().optional(),
    punishments: z.string().snowflake().optional(),
  }),
})

export const autoMessagesSchema = moduleSchema({
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

export const autoRolesSchema = moduleSchema({
  roles: z
    .object({
      id: z.string().snowflake("Role is required"),
      target: z.enum(["everyone", "members", "bots"]),
    })
    .array()
    .max(10),
})

export const bumpRemindersSchema = moduleSchema({
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

export const countersSchema = moduleSchema({
  counters: z
    .object({
      // name: z.string().nonempty("Name is required"),
      channel: z.string().snowflake("Channel is required"),
      content: z
        .string()
        .nonempty("Content is required")
        .max(100, "Content cannot be longer than 100 characters"),
    })
    .array()
    .max(10),
})

export const formsSchema = moduleSchema({
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

export const joinToCreatesSchema = moduleSchema({
  channel: z.string().snowflake("Channel is required"),
  category: z.string().snowflake("Category is required"),
})

export const levelsSchema = moduleSchema({
  replyType: z.enum(["reply", "dm", "channel"]),
  channel: z.string().optional(),
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
}).transform(({ channel, ...data }) => ({
  ...data,
  channel: data.replyType === "channel" ? channel! : data.replyType,
}))

export const reactionRolesSchema = moduleSchema({
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

export const selfRolesSchema = moduleSchema({
  messages: z
    .union([
      z.object({
        id: z.string().uuid(),
        type: z.literal("reaction"),
        name: z.string().nonempty("Name is required"),
        channel: z.string().snowflake("Channel is required"),
        content: z.string().nonempty("Content is required"),
        multiselect: z.boolean(),
        methods: z
          .object({
            id: z.string().uuid(),
            emoji: z.string().emoji("Emoji is required"),
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
          .array()
          .min(1, "At least one method is required")
          .max(20, "Maximum of 20 methods allowed"),
      }),
      z.object({
        id: z.string().uuid(),
        type: z.literal("button"),
        name: z.string().nonempty("Name is required"),
        channel: z.string().snowflake("Channel is required"),
        content: z.string().nonempty("Content is required"),
        multiselect: z.boolean().default(false),
        methods: z
          .object({
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
          .array()
          .min(1, "At least one method is required")
          .max(20, "Maximum of 20 methods allowed"),
      }),
      z.object({
        id: z.string().uuid(),
        type: z.literal("dropdown"),
        name: z
          .string()
          .nonempty("Name is required")
          .max(256, "Maximum of 256 characters allowed"),
        channel: z.string().snowflake("Channel is required"),
        content: z
          .string()
          .nonempty("Content is required")
          .max(512, "Maximum of 512 characters allowed"),
        multiselect: z.boolean().default(false),
        methods: z
          .object({
            id: z.string().uuid(),
            emoji: z.string().emoji().optional(),
            label: z
              .string()
              .nonempty("Label is required")
              .max(80, "Maximum of 80 characters allowed"),
            rolesToAdd: z
              .string()
              .snowflake()
              .array()
              .max(10, "Maximum of 10 roles allowed")
              .default([]),
            rolesToRemove: z
              .string()
              .snowflake()
              .array()
              .max(10, "Maximum of 10 roles allowed")
              .default([]),
          })
          .array()
          .min(1, "At least one method is required")
          .max(20, "Maximum of 20 methods allowed"),
      }),
    ])
    .array()
    .min(1)
    .max(10, "Maximum of 10 messages allowed"),
})

export const ticketsSchema = moduleSchema({
  channel: z.string().nonempty("Channel is required"),
  category: z
    .string()
    .nullish()
    .transform((str) => str ?? undefined),
  message: z
    .string()
    .max(1000, "Message must be less than 1000 characters")
    .trim()
    .nullish()
    .transform((str) => str ?? undefined),
  max_open: z
    .number()
    .int()
    .nullish()
    .transform((int) => int ?? undefined),
  tickets: z
    .object({
      id: z.string().uuid(),
      name: z
        .string()
        .nonempty("Name is required")
        .max(32, "Name cannot be longer than 32 characters"),
      message: z
        .string()
        .nonempty("Message is required")
        .max(1000, "Message must be less than 1000 characters"),
      mention: z
        .string()
        .nullish()
        .transform((str) => str ?? undefined),
      reason: z
        .enum(["required", "optional", "disabled"])
        .default("disabled")
        .optional(),
    })
    .array()
    .max(5),
})

export const twitchNotificationsSchema = moduleSchema({
  streamers: z
    .object({
      id: z
        .string()
        .min(4, "The streamer name must be at least 4 characters")
        .max(25, "The streamer name must be less than 25 characters"),
      channel: z.string().snowflake("You must select a channel"),
      mention: z
        .string()
        .mention()
        .nullish()
        .transform((str) => str ?? undefined),
    })
    .array()
    .max(5),
})

export const warningsSchema = moduleSchema({
  warnings: z
    .object({ role: z.string().snowflake("Role is required") })
    .array()
    .max(10),
})

export const welcomeMessagesSchema = moduleSchema({
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
      .nullish()
      .transform((str) => str ?? undefined),
  }),
})

export const modulesSchema = z
  .object({
    [ModuleId.AuditLogs]: auditLogsSchema,
    [ModuleId.AutoMessages]: autoMessagesSchema,
    [ModuleId.AutoRoles]: autoRolesSchema,
    [ModuleId.BumpReminders]: bumpRemindersSchema,
    [ModuleId.Counters]: countersSchema,
    [ModuleId.Forms]: formsSchema,
    [ModuleId.JoinToCreates]: joinToCreatesSchema,
    [ModuleId.Levels]: levelsSchema,
    [ModuleId.ReactionRoles]: reactionRolesSchema,
    [ModuleId.SelfRoles]: selfRolesSchema,
    [ModuleId.Tickets]: ticketsSchema,
    [ModuleId.TwitchNotifications]: twitchNotificationsSchema,
    [ModuleId.Warnings]: warningsSchema,
    [ModuleId.WelcomeMessages]: welcomeMessagesSchema,
  })
  .partial()

export const moduleIdSchema = z.nativeEnum(ModuleId)
