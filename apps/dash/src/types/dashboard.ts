import type { TRPCGuild } from "@repo/trpc/client"
import type { ModuleDefinitions, ModuleId } from "@repo/utils/modules"
import type { Mutable, Prettify } from "@repo/utils/types"
import type { z } from "@repo/zod"
import type { modulesFormSchema, modulesTrpcSchema } from "~/lib/schemas"
import type { Session } from "~/types/auth"
import type { UseFormReturn } from "react-hook-form"

export type ModulesTRPCSchemaType = z.TypeOf<typeof modulesTrpcSchema>
export type ModulesFormSchemaType = z.TypeOf<typeof modulesFormSchema>

export type ModulesFormReturn = UseFormReturn<ModulesFormSchemaType>

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
