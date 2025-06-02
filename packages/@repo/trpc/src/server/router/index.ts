import { EmbedBuilder, roleMention } from "discord.js"

import { z } from "@repo/zod"

import { authRouter } from "~/server/router/auth"
import { guildsRouter } from "~/server/router/guilds"
import { privateProcedure, router } from "~/server/trpc"

export const appRouter = router({
  auth: authRouter,
  guilds: guildsRouter,
  createBugReport: privateProcedure
    .input(
      z.object({
        subject: z.string(),
        urgency: z.enum(["low", "medium", "high"]),
        body: z.string(),
        guildId: z.string().snowflake().optional(),
        channelId: z.string().snowflake().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { phase } = ctx

      const channelId = "1263379108453158922"
      const roleId = "1078441789985411172"

      const channel = phase.client.channels.cache.get(channelId)
      if (!channel || channel.isDMBased() || !channel.isSendable()) return

      try {
        await channel.send({
          content: roleMention(roleId),
          embeds: [
            new EmbedBuilder()
              .setTitle("New Bug Report")
              .setDescription("Submitted using the bug report form.")
              .setColor("Red")
              .setTimestamp()
              .setFields([
                { name: "Subject", value: input.subject, inline: true },
                {
                  name: "Urgency",
                  value: {
                    low: "🟦 Low",
                    medium: "🟨 Medium",
                    high: "🟥 High",
                  }[input.urgency],
                  inline: true,
                },
                { name: "Body", value: input.body, inline: false },
                {
                  name: "Guild ID",
                  value: input.guildId ?? "Not provided",
                  inline: true,
                },
                {
                  name: "Channel ID",
                  value: input.channelId ?? "Not provided",
                  inline: true,
                },
              ]),
          ],
        })

        return true
      } catch (error) {
        console.error(`Failed to send bug report:`)
        console.error(error)

        return false
      }
    }),
})

export type AppRouter = typeof appRouter
