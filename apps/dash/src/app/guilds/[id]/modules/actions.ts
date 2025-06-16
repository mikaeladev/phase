"use server"

import { moduleIdSchema, transformFormValues } from "@repo/utils/modules"
import { z } from "@repo/zod"

import { getSession } from "~/lib/auth"
import { modulesFormSchema } from "~/lib/schemas"
import { createClient } from "~/lib/trpc"

import type { TRPCGuild } from "@repo/trpc/client"
import type {
  ModulesFormSchemaType,
  ModulesTRPCSchemaType,
} from "~/types/dashboard"

export async function updateModules(
  unsafe_guildId: string,
  unsafe_formValues: ModulesFormSchemaType,
  unsafe_dirtyKeys: (keyof ModulesFormSchemaType)[],
): Promise<TRPCGuild["modules"]> {
  const guildId = z.string().snowflake().parse(unsafe_guildId)
  const formValues = modulesFormSchema.parse(unsafe_formValues)
  const dirtyKeys = moduleIdSchema.array().parse(unsafe_dirtyKeys)

  const session = await getSession()
  const client = createClient({ adminId: session.user.id, guildId })

  const input = dirtyKeys.reduce<ModulesTRPCSchemaType>((acc, field) => {
    const config = formValues[field]
    return {
      ...acc,
      [field]: config ? transformFormValues(field, config) : null,
    }
  }, {})

  const result = await client.guilds.modules.update.mutate(input)

  return result
}
