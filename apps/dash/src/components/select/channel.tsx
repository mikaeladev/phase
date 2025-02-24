import * as React from "react"

import { ChannelType } from "discord-api-types/v10"

import {
  Combobox,
  ComboboxContent,
  ComboboxTrigger,
  ComboboxValue,
} from "@repo/ui/combobox"
import { AllowedChannelTypes, channelIcons } from "~/components/channel-icons"

import { useDashboardContext } from "~/hooks/use-dashboard-context"

import type { ComboboxItem } from "@repo/ui/combobox"
import type { Arrayable, Optional } from "~/types/utils"

export interface SelectChannelProps<
  TMultiselect extends boolean,
  TValue extends Optional<Arrayable<string, TMultiselect>>,
> {
  channelType?: keyof typeof AllowedChannelTypes
  placeholder?: string
  multiselect?: TMultiselect
  disabled?: boolean
  name: string
  value: TValue
  onValueChange: (value: TValue) => void
}

export function SelectChannel<
  TMultiselect extends boolean,
  TValue extends Optional<Arrayable<string, TMultiselect>>,
>({
  disabled,
  channelType = "GuildText",
  placeholder = "Select a channel",
  ...props
}: SelectChannelProps<TMultiselect, TValue>) {
  const dashboardData = useDashboardContext()
  const guildData = React.use(dashboardData.guild)

  const items = React.useMemo(() => {
    const categories = guildData.channels
      .filter(
        (channel) =>
          (channel.type as ChannelType) === ChannelType.GuildCategory,
      )
      .sort((a, b) => a.position + b.position)

    const items: ComboboxItem[] = []

    if (channelType === "GuildCategory") {
      items.push(
        ...categories.map((category) => {
          const ChannelIcon = channelIcons[category.type]
          return {
            label: category.name,
            value: category.id,
            icon: <ChannelIcon />,
          }
        }),
      )
    } else {
      for (const category of categories) {
        const channels = guildData.channels
          .filter(
            (channel) =>
              channel.parentId === category.id &&
              AllowedChannelTypes[channelType] === channel.type,
          )
          .sort((a, b) => a.position + b.position)

        items.push(
          ...channels.map((channel): ComboboxItem => {
            const ChannelIcon = channelIcons[channel.type]
            return {
              label: channel.name,
              value: channel.id,
              group: category.name,
              icon: <ChannelIcon />,
            }
          }),
        )
      }
    }

    return items
  }, [channelType, guildData.channels])

  return (
    <Combobox>
      <ComboboxTrigger disabled={disabled}>
        <ComboboxValue placeholder={placeholder} />
      </ComboboxTrigger>
      <ComboboxContent items={items} {...props} />
    </Combobox>
  )
}
