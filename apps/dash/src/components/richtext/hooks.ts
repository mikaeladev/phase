import * as React from "react"

import { AllowedChannelTypes } from "~/components/channel-icons"

import { useDashboardContext } from "~/hooks/use-dashboard-context"

import type { RichtextFlags } from "./index"
import type { GuildElementData } from "~/types/slate"
import type { ChannelType } from "discord-api-types/v10"

export function useGuildData(flags: RichtextFlags) {
  const dashboardData = useDashboardContext(!flags.channels && !flags.mentions)
  const guildData = React.use(dashboardData!.guild)

  const guildElementData: GuildElementData = React.useMemo(
    () => ({
      channels:
        guildData.channels
          .filter(
            (channel) =>
              AllowedChannelTypes.GuildCategory !==
                (channel.type as ChannelType) &&
              Object.values(AllowedChannelTypes).includes(channel.type),
          )
          .map((channel) => ({
            id: channel.id,
            name: channel.name,
            type: channel.type,
          })) ?? [],
      mentions: [
        {
          id: "everyone",
          name: "everyone",
          type: "everyone",
          colour: "#f8f8f8",
        },
        {
          id: "here",
          name: "here",
          type: "here",
          colour: "#f8f8f8",
        },
        ...(guildData.roles.map((role) => ({
          id: role.id,
          name: role.name,
          type: "role" as const,
          colour:
            role.color !== 0
              ? `#${role.color.toString(16).padStart(6, "0")}`
              : "#f8f8f8",
        })) ?? []),
      ],
    }),
    [guildData.channels, guildData.roles],
  )

  return guildElementData
}
