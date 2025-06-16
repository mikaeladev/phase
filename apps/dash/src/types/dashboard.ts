import type { Session } from "@repo/auth"
import type { TRPCGuild } from "@repo/trpc/client"
import type { ModuleDefinitions, ModuleId } from "@repo/utils/modules"
import type { z } from "@repo/zod"
import type { modulesFormSchema, modulesTrpcSchema } from "~/lib/schemas"
import type { GuildModules } from "~/types/db"
import type { Mutable, Prettify } from "~/types/utils"
import type { UseFormReturn } from "react-hook-form"

type ExtraModuleFormData = {
  [ModuleId.TwitchNotifications]: {
    streamerNames: Record<number, string>
  }
}

export type ModulesTRPCSchemaType = z.TypeOf<typeof modulesTrpcSchema>
export type ModulesFormSchemaType = z.TypeOf<typeof modulesFormSchema>

export type ModulesFormReturn = UseFormReturn<ModulesFormSchemaType>

export type ModulesFormValuesInputWithExtraData = Partial<{
  [K in ModuleId]: K extends keyof ExtraModuleFormData
    ? ModulesFormSchemaType[K] & { _data: ExtraModuleFormData[K] }
    : ModulesFormSchemaType[K]
}>

export type GuildModulesWithExtraData = Partial<{
  [K in ModuleId]: K extends keyof ExtraModuleFormData
    ? GuildModules[K] & { _data: ExtraModuleFormData[K] }
    : GuildModules[K]
}>

type ModuleDefinition<T extends ModuleId = ModuleId> =
  (typeof ModuleDefinitions)[T]

export type ModuleDefinitionWithConfig<T extends ModuleId = ModuleId> = {
  [K in ModuleId]: Prettify<
    Mutable<ModuleDefinition<K>> & {
      config: ModulesFormSchemaType[K]
    }
  >
}[T]

export type DashboardData = {
  session: Session
  guild: Promise<TRPCGuild>
}
