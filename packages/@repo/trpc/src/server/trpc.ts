import { z } from "@repo/zod"
import { initTRPC, TRPCError } from "@trpc/server"

import type {
  Context,
  ContextWithAdminAuth,
  ContextWithGuildAuth,
} from "~/server/context"

const t = initTRPC.context<Context>().create()

const tokenMiddleware = t.middleware(async ({ ctx, next }) => {
  const { headers } = ctx.req

  const authTokenHeader = headers.get("Authorization") ?? ""
  const [authPrefix, authToken] = authTokenHeader.split(" ")

  if (authPrefix !== "Secret" || authToken !== ctx.env.TRPC_TOKEN) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid auth token",
    })
  }

  return next({ ctx })
})

const adminMiddleware = tokenMiddleware.unstable_pipe(async ({ ctx, next }) => {
  const { headers } = ctx.req

  const adminIdHeader = headers.get("X-Admin-ID") ?? ""

  if (!z.string().snowflake().safeParse(adminIdHeader).success) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Admin ID is not a snowflake",
    })
  }

  const isValidAdmin = ctx.phase.stores.guilds.some((guild) => {
    return guild.admins.includes(adminIdHeader)
  })

  if (!isValidAdmin) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Admin not found",
    })
  }

  const newCtx: ContextWithAdminAuth = {
    db: ctx.db,
    env: ctx.env,
    phase: ctx.phase,
    req: ctx.req,
    auth: {
      adminId: adminIdHeader,
    },
  }

  return next({ ctx: newCtx })
})

const guildMiddleware = adminMiddleware.unstable_pipe(async ({ ctx, next }) => {
  const { headers } = ctx.req

  const guildIdHeader = headers.get("X-Guild-ID") ?? ""

  if (!z.string().snowflake().safeParse(guildIdHeader).success) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Guild ID is not a snowflake",
    })
  }

  const guildDoc = ctx.phase.stores.guilds.get(guildIdHeader)
  const guildAPI = ctx.phase.client.guilds.cache.get(guildIdHeader)

  if (!guildDoc || !guildAPI) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Guild not found",
    })
  }

  if (!guildDoc.admins.includes(ctx.auth.adminId)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have permission to access this guild",
    })
  }

  const newCtx: ContextWithGuildAuth = {
    db: ctx.db,
    env: ctx.env,
    phase: ctx.phase,
    req: ctx.req,
    auth: {
      adminId: ctx.auth.adminId,
      guildId: guildIdHeader,
      guildDoc: guildDoc,
      guildAPI: guildAPI,
    },
  }

  return next({ ctx: newCtx })
})

export const router = t.router
export const publicProcedure = t.procedure
export const privateProcedure = t.procedure.use(tokenMiddleware)
export const privateAdminProcedure = t.procedure.use(adminMiddleware)
export const privateGuildProcedure = t.procedure.use(guildMiddleware)
