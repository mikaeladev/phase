import { BotEventBuilder } from "@phasejs/builders"

import { ModuleId } from "@repo/utils/modules"

import { hasRequiredGuildPermissions, mapInvite } from "./_utils"

export default new BotEventBuilder()
  .setName("inviteCreate")
  .setExecute(async (client, invite, ctx) => {
    const guild = client.guilds.resolve(invite)
    if (!guild || !hasRequiredGuildPermissions(guild)) return

    const guildDoc = ctx.phase.stores.guilds.get(guild.id)

    const moduleConfig = guildDoc?.modules?.[ModuleId.AuditLogs]
    if (!moduleConfig?.enabled || !moduleConfig.channels.invites) return

    const inviteStore = ctx.phase.stores.invites.get(guild.id)
    if (!inviteStore) return

    inviteStore.set(invite.code, mapInvite(invite))
  })
