import { BotCronBuilder } from "@phasejs/builders"

import { ModuleId } from "@repo/utils/modules"

import {
  hasRequiredGuildPermissions,
  mapInvite,
} from "~/app/events/(modules)/invite-logs/_utils"

export default new BotCronBuilder()
  .setPattern("* * * * *")
  .setExecute(async (client, ctx) => {
    for (const guild of client.guilds.cache.values()) {
      const hasInvitesInStore = ctx.phase.stores.invites.has(guild.id)

      if (!hasRequiredGuildPermissions(guild)) {
        if (hasInvitesInStore) ctx.phase.stores.invites.delete(guild.id)
        continue
      }

      const guildDoc = ctx.phase.stores.guilds.get(guild.id)

      if (!guildDoc) {
        if (hasInvitesInStore) ctx.phase.stores.invites.delete(guild.id)
        continue
      }

      const moduleConfig = guildDoc.modules?.[ModuleId.AuditLogs]

      if (!moduleConfig?.enabled || !moduleConfig.channels.invites) {
        if (hasInvitesInStore) ctx.phase.stores.invites.delete(guild.id)
        continue
      }

      if (hasInvitesInStore) continue

      const invites = await guild.invites.fetch()
      ctx.phase.stores.invites.set(guild.id, invites.mapValues(mapInvite))
    }
  })
