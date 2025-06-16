import { z } from "@repo/zod"

import { ModuleId } from "./ids"
import { auditLogs } from "./schemas/audit-logs"
import { autoMessages } from "./schemas/auto-messages"
import { autoRoles } from "./schemas/auto-roles"
import { bumpReminders } from "./schemas/bump-reminders"
import { counters } from "./schemas/counters"
import { forms } from "./schemas/forms"
import { joinToCreates } from "./schemas/join-to-creates"
import { levels } from "./schemas/levels"
import { reactionRoles } from "./schemas/reaction-roles"
import { selfRoles } from "./schemas/self-roles"
import { tickets } from "./schemas/tickets"
import { twitchNotifications } from "./schemas/twitch-notifications"
import { warnings } from "./schemas/warnings"
import { welcomeMessages } from "./schemas/welcome-messages"

export const formModuleSchemas = {
  [ModuleId.AuditLogs]: auditLogs.baseSchema,
  [ModuleId.AutoMessages]: autoMessages.baseSchema,
  [ModuleId.AutoRoles]: autoRoles.baseSchema,
  [ModuleId.BumpReminders]: bumpReminders.baseSchema,
  [ModuleId.Counters]: counters.baseSchema,
  [ModuleId.Forms]: forms.baseSchema,
  [ModuleId.JoinToCreates]: joinToCreates.baseSchema,
  [ModuleId.Levels]: levels.baseSchema,
  [ModuleId.ReactionRoles]: reactionRoles.baseSchema,
  [ModuleId.SelfRoles]: selfRoles.baseSchema,
  [ModuleId.Tickets]: tickets.baseSchema,
  [ModuleId.TwitchNotifications]: twitchNotifications.baseSchema,
  [ModuleId.Warnings]: warnings.baseSchema,
  [ModuleId.WelcomeMessages]: welcomeMessages.baseSchema,
}

export const trpcModuleSchemas = {
  [ModuleId.AuditLogs]: auditLogs.transformedSchema,
  [ModuleId.AutoMessages]: autoMessages.transformedSchema,
  [ModuleId.AutoRoles]: autoRoles.transformedSchema,
  [ModuleId.BumpReminders]: bumpReminders.transformedSchema,
  [ModuleId.Counters]: counters.transformedSchema,
  [ModuleId.Forms]: forms.transformedSchema,
  [ModuleId.JoinToCreates]: joinToCreates.transformedSchema,
  [ModuleId.Levels]: levels.transformedSchema,
  [ModuleId.ReactionRoles]: reactionRoles.transformedSchema,
  [ModuleId.SelfRoles]: selfRoles.transformedSchema,
  [ModuleId.Tickets]: tickets.transformedSchema,
  [ModuleId.TwitchNotifications]: twitchNotifications.transformedSchema,
  [ModuleId.Warnings]: warnings.transformedSchema,
  [ModuleId.WelcomeMessages]: welcomeMessages.transformedSchema,
}

export const moduleSchemaTransforms = {
  [ModuleId.AuditLogs]: auditLogs.transform,
  [ModuleId.AutoMessages]: autoMessages.transform,
  [ModuleId.AutoRoles]: autoRoles.transform,
  [ModuleId.BumpReminders]: bumpReminders.transform,
  [ModuleId.Counters]: counters.transform,
  [ModuleId.Forms]: forms.transform,
  [ModuleId.JoinToCreates]: joinToCreates.transform,
  [ModuleId.Levels]: levels.transform,
  [ModuleId.ReactionRoles]: reactionRoles.transform,
  [ModuleId.SelfRoles]: selfRoles.transform,
  [ModuleId.Tickets]: tickets.transform,
  [ModuleId.TwitchNotifications]: twitchNotifications.transform,
  [ModuleId.Warnings]: warnings.transform,
  [ModuleId.WelcomeMessages]: welcomeMessages.transform,
}

export const moduleIdSchema = z.nativeEnum(ModuleId)

export function transformFormValues<T extends ModuleId>(
  id: T,
  values: z.TypeOf<(typeof formModuleSchemas)[T]>,
) {
  const transform = moduleSchemaTransforms[id]
  return transform(values as never) as ReturnType<
    (typeof moduleSchemaTransforms)[T]
  > // TODO: make this type safe somehow ??
}
