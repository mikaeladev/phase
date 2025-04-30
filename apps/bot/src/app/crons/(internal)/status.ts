import { BotCronBuilder } from "@phasejs/builders"
import { ActivityType } from "discord.js"

export default new BotCronBuilder()
  .setPattern("*/30 * * * * *") // every 30 seconds
  .setExecute(async (client, ctx) => {
    const statusType = ctx.phase.stores.config.status.type
    const statusText = ctx.phase.stores.config.status.text

    const botStatusType = client.user.presence.status
    const botStatusText = client.user.presence.activities[0]?.state

    if (botStatusType !== statusType) {
      client.user.setStatus(statusType)
    }

    if (botStatusText !== statusText) {
      client.user.setActivity(statusText, { type: ActivityType.Custom })
    }
  })
