import { botEvent } from "phase.js"
import { GuildSchema } from "@repo/schemas"
import { alertDevs } from "~/utils"

export default botEvent("guildCreate", async (client, guild) => {
  const guildSchema = await GuildSchema.findOne({ id: guild.id })
  if (guildSchema) return

  await new GuildSchema({
    id: guild.id,
    admins: [guild.ownerId],
    commands: {},
    modules: {
      AuditLogs: { enabled: false },
      AutoPartners: { enabled: false },
      AutoRoles: { enabled: false },
      JoinToCreates: { enabled: false },
      Levels: { enabled: false },
      ReactionRoles: { enabled: false },
      Tickets: { enabled: false },
    },
    news_channel: null,
  }).save()

  await alertDevs({
    title: "New guild",
    description: `**Name:** \`${guild.name}\`\n**ID:** \`${guild.id}\`\n**Members:** \`${guild.memberCount}\`\n\n**New Guild count:** \`${client.guilds.cache.size}\``,
    type: "message",
  })
})