import { createHmac } from "node:crypto"

import { makeURLSearchParams, Routes } from "discord.js"

import { z } from "@repo/zod"

import { privateProcedure, router } from "~/server/trpc"

export const authRouter = router({
  validateOTP: privateProcedure
    .input(z.object({ code: z.string().max(6) }))
    .query(async ({ ctx, input }) => {
      const signedCode = createHmac("sha256", ctx.env.AUTH_OTP_SECRET)
        .update(input.code)
        .digest("hex")

      const optDoc = await ctx.db.otps.findOneAndDelete({ otp: signedCode })
      if (!optDoc) return null

      return {
        userId: optDoc.userId,
        guildId: optDoc.guildId,
      }
    }),

  revokeToken: privateProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { phase } = ctx

      await phase.client.rest.post(Routes.oauth2TokenRevocation(), {
        auth: false,
        passThroughBody: true,
        body: makeURLSearchParams({
          token: input.token,
          token_type_hint: "access_token",
        }),
        headers: {
          Authorization: `Basic ${Buffer.from(`${ctx.env.DISCORD_ID}:${ctx.env.DISCORD_SECRET}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
    }),
})
