import { createHmac } from "node:crypto"

import { z } from "zod"

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
})
