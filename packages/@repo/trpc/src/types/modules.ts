import type { GuildModules } from "@repo/db"
import type { ModuleId } from "@repo/utils/modules"

export type ExtraModuleFormData = {
  [ModuleId.TwitchNotifications]: {
    streamerNames: Record<number, string>
  }
}

export type GuildModulesWithExtraData = Partial<{
  [K in ModuleId]: K extends keyof ExtraModuleFormData
    ? GuildModules[K] & { _data: ExtraModuleFormData[K] }
    : GuildModules[K]
}>
