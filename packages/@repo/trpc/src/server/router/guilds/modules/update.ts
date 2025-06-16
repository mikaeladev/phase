import { trpcModuleSchemas } from "@repo/utils/modules"
import { z } from "@repo/zod"

import { privateGuildProcedure } from "~/server/trpc"
import { transformUpdateInput, transformUpdateOutput } from "./_transform"
import { updateModuleDependents } from "./_update"

import type { GuildModules } from "@repo/db"
import type { ModuleId } from "@repo/utils/modules"
import type { NullishPartial } from "~/types/utils"

export const updateInputSchema = z.object(trpcModuleSchemas).nullablePartial()
export type UpdateInputSchemaType = z.TypeOf<typeof updateInputSchema>

export const updateProcedures = {
  update: privateGuildProcedure
    .input(updateInputSchema)
    .mutation(async ({ ctx, input }) => {
      const { db, auth } = ctx
      const { guildDoc } = auth

      const transformedInput = await transformUpdateInput(ctx, input)

      type SetKey = `modules.${ModuleId}`

      const modulesToSet: Partial<Record<SetKey, GuildModules[ModuleId]>> = {}
      const modulesToUnset: Partial<Record<SetKey, null>> = {}

      for (const [id, config] of Object.entries(transformedInput)) {
        if (config !== null) modulesToSet[`modules.${id as ModuleId}`] = config
        else modulesToUnset[`modules.${id as ModuleId}`] = null
      }

      await db.guilds.updateOne(
        { _id: guildDoc._id },
        {
          $set: modulesToSet,
          $unset: modulesToUnset,
        },
      )

      await updateModuleDependents(ctx, transformedInput)

      const output = {
        ...(guildDoc.modules ?? {}),
        ...(
          Object.entries(transformedInput) as [
            ModuleId,
            NullishPartial<GuildModules>[ModuleId],
          ][]
        ).reduce(
          (acc, [id, config]) => ({ ...acc, [id]: config ?? undefined }),
          {} as GuildModules,
        ),
      }

      const transformedOutput = transformUpdateOutput(ctx, output)

      return transformedOutput
    }),
}
