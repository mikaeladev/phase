import { TRPCError } from "@trpc/server"

import { modulesRouter } from "~/server/router/guilds/modules"
import {
  privateAdminProcedure,
  privateGuildProcedure,
  router,
} from "~/server/trpc"
import { transformBotGuild } from "~/server/utils"

export const guildsRouter = router({
  getAll: privateAdminProcedure.query(async ({ ctx }) => {
    const { phase, auth } = ctx
    const { adminId } = auth

    const guildDocs = phase.stores.guilds.filter((guild) =>
      guild.admins.includes(adminId),
    )

    const trpcGuildPromises = guildDocs.map((guildDoc, guildId) => {
      const guildAPI = phase.client.guilds.cache.get(guildId)

      if (!guildAPI) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Guild not found",
        })
      }

      return transformBotGuild({
        ...ctx,
        auth: {
          adminId,
          guildId,
          guildDoc,
          guildAPI,
        },
      })
    })

    const trpcGuilds = await Promise.all(trpcGuildPromises)
    return trpcGuilds
  }),

  getCurrent: privateGuildProcedure.query(async ({ ctx }) => {
    const trpcGuild = await transformBotGuild(ctx)
    return trpcGuild
  }),

  modules: modulesRouter,
})
