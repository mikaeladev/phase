import { ModuleId } from "@repo/utils/modules"
import { ms } from "@repo/utils/ms"

import { entries, keys } from "~/lib/utils"

import type { TRPCGuild } from "@repo/trpc/client"
import type { ModulesFormSchemaType } from "~/types/dashboard"
import type { UseFormReturn } from "react-hook-form"

export const emptyFormValues: Required<ModulesFormSchemaType> = {
  [ModuleId.AuditLogs]: {
    enabled: false,
    channels: {
      server: "",
      members: "",
      messages: "",
      punishments: "",
      voice: "",
      invites: "",
    },
  },
  [ModuleId.AutoMessages]: {
    enabled: false,
    messages: [],
  },
  [ModuleId.AutoRoles]: {
    enabled: false,
    roles: [],
  },
  [ModuleId.BumpReminders]: {
    enabled: false,
    time: "",
    initialMessage: "",
    reminderMessage: "",
  },
  [ModuleId.Counters]: {
    enabled: false,
    counters: [],
  },
  [ModuleId.Forms]: {
    enabled: false,
    channel: "",
    forms: [],
  },
  [ModuleId.JoinToCreates]: {
    enabled: false,
    channel: "",
    category: "",
  },
  [ModuleId.Levels]: {
    enabled: false,
    replyType: "reply",
    channel: "",
    message: "",
    background: "",
    mention: false,
    roles: [],
  },
  [ModuleId.ReactionRoles]: {
    enabled: false,
    messageUrl: "",
    reactions: [],
  },
  [ModuleId.SelfRoles]: {
    enabled: false,
    messages: [],
  },
  [ModuleId.Tickets]: {
    enabled: false,
    channel: "",
    message: "",
    max_open: Infinity,
    tickets: [],
  },
  [ModuleId.TwitchNotifications]: {
    enabled: false,
    streamers: [],
  },
  [ModuleId.Warnings]: {
    enabled: false,
    warnings: [],
  },
  [ModuleId.WelcomeMessages]: {
    enabled: false,
    channel: "",
    message: "",
    mention: false,
    card: {
      enabled: false,
      background: "",
    },
  },
}

export function getDirtyKeys(form: UseFormReturn<ModulesFormSchemaType>) {
  const { formState } = form
  const { isDirty, dirtyFields } = formState

  if (!isDirty) return []

  type DirtyField =
    | boolean
    | undefined
    | { [key: string]: DirtyField }
    | DirtyField[]

  const recursivelyCheckField = (field: DirtyField): boolean => {
    if (typeof field === "object") {
      const subfields = Array.isArray(field) ? field : Object.values(field)
      return subfields.some(recursivelyCheckField)
    }

    return field === true
  }

  return keys(dirtyFields).flatMap((key) =>
    recursivelyCheckField(dirtyFields[key]) ? key : [],
  )
}

export function getInvalidKeys(form: UseFormReturn<ModulesFormSchemaType>) {
  const { formState } = form
  return keys(formState.errors)
}

export function resolveFormValues(
  guild: Pick<TRPCGuild, "id" | "modules">,
): ModulesFormSchemaType {
  const modules = guild.modules ?? {}

  return entries(modules).reduce<ModulesFormSchemaType>((acc, [id, config]) => {
    switch (id) {
      case ModuleId.AutoMessages:
        return {
          ...acc,
          [id]: {
            ...config,
            messages: config.messages.map((msg) => ({
              ...msg,
              interval: ms(msg.interval, { long: true })!,
              content: msg.message,
            })),
          },
        }
      case ModuleId.BumpReminders:
        return {
          ...acc,
          [id]: {
            ...config,
            time: ms(config.time, { long: true })!,
          },
        }
      case ModuleId.ReactionRoles:
        return {
          ...acc,
          [id]: {
            ...config,
            messageUrl: `https://discord.com/channels/${guild.id}/${config.channel}/${config.message}`,
          },
        }
      case ModuleId.Levels:
        return {
          ...acc,
          [id]: {
            ...config,
            replyType:
              config.channel === "dm" || config.channel === "reply"
                ? config.channel
                : config.channel.length
                  ? "channel"
                  : emptyFormValues[ModuleId.Levels].replyType,
          },
        }
      case ModuleId.SelfRoles:
        return {
          ...acc,
          [id]: {
            ...config,
            messages: config.messages.map((message) => ({
              ...message,
              methods: message.methods.map(({ roles, ...method }) => ({
                ...method,
                rolesToAdd: roles
                  .filter((role) => role.action === "add")
                  .map(({ id }) => id),
                rolesToRemove: roles
                  .filter((role) => role.action === "remove")
                  .map(({ id }) => id),
              })),
            })) as Required<ModulesFormSchemaType>[ModuleId.SelfRoles]["messages"],
          },
        }
      case ModuleId.TwitchNotifications:
        return {
          ...acc,
          [id]: {
            ...config,
            streamers: config.streamers.map((streamer, index) => {
              const streamerNames = config._data?.streamerNames
              const streamerName = streamerNames?.[index]

              return {
                ...streamer,
                username: streamerName ?? "unknown",
              }
            }),
          },
        }
      case ModuleId.Warnings:
        return {
          ...acc,
          [id]: {
            ...config,
            warnings: config.warnings.map((role: string) => ({
              role,
            })),
          },
        }
      default:
        return { ...acc, [id]: config }
    }
  }, {})
}
