import { BotEventBuilder } from "@phasejs/builders"
import { GuildFeature } from "discord.js"

import { ModuleId } from "@repo/utils/modules"

const verificationGate = GuildFeature.MemberVerificationGateEnabled

export default new BotEventBuilder()
  .setName("guildMemberAdd")
  .setExecute(async (_, member, ctx) => {
    if (member.guild.features.includes(verificationGate)) return

    const guildDoc = ctx.phase.stores.guilds.get(member.guild.id)
    const autoRolesModule = guildDoc?.modules?.[ModuleId.AutoRoles]

    if (!autoRolesModule?.enabled) return

    for (const role of autoRolesModule.roles) {
      if (role.target === "bots" && !member.user.bot) continue
      if (role.target === "members" && member.user.bot) continue

      if (
        member.guild.roles.cache.get(role.id) &&
        !member.roles.cache.has(role.id)
      ) {
        await member.roles.add(role.id).catch(() => null)
      }
    }
  })
