import { moduleIdSchema } from "@repo/utils/modules"
import { z } from "@repo/zod"
import { TRPCError } from "@trpc/server"

import { privateGuildProcedure } from "~/server/trpc"

export const toggleProcedures = {
  toggle: privateGuildProcedure
    .input(z.object({ id: moduleIdSchema }))
    .mutation(async ({ ctx, input }) => {
      const { db, auth } = ctx
      const { guildDoc } = auth
      const { id } = input

      if (!guildDoc.modules?.[id]) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Module not configured",
        })
      }

      try {
        const oldValue = guildDoc.modules[id].enabled

        await db.guilds.updateOne(
          { _id: guildDoc._id },
          { $set: { [`modules.${id}.enabled`]: !oldValue } },
        )

        return { enabled: !oldValue }
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to toggle module",
          cause: error,
        })
      }
    }),
}
