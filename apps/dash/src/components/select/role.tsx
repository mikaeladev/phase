"use client"

import * as React from "react"

import {
  Combobox,
  ComboboxContent,
  ComboboxTrigger,
  ComboboxValue,
} from "@repo/ui/combobox"
import { AtSignIcon, LockIcon } from "@repo/ui/lucide-icon"

import { useDashboardContext } from "~/hooks/use-dashboard-context"

import type { ComboboxItem } from "@repo/ui/combobox"
import type { Arrayable, Optional } from "~/types/utils"

interface SelectRoleProps<
  TMultiselect extends boolean,
  TValue extends Optional<Arrayable<string, TMultiselect>>,
> {
  placeholder?: string
  multiselect?: TMultiselect
  disabled?: boolean
  name: string
  value: TValue
  onValueChange: (value: TValue) => void
}

export function SelectRole<
  TMultiselect extends boolean,
  TValue extends Optional<Arrayable<string, TMultiselect>>,
>({
  disabled,
  placeholder = "Select a role",
  ...props
}: SelectRoleProps<TMultiselect, TValue>) {
  const dashboardData = useDashboardContext()
  const guildData = React.use(dashboardData.guild)

  const items = React.useMemo(() => {
    const items: ComboboxItem[] = []

    const roles = guildData.roles
    const sortedRoles = roles.sort((a, b) => b.position - a.position)

    for (const role of sortedRoles) {
      const isDisabled = false

      const hexColour = role.color
        ? (`#${role.color.toString(16).padStart(6, "0")}` as const)
        : undefined

      items.push({
        label: role.name,
        value: role.id,
        disabled: isDisabled,
        colour: hexColour,
        icon: isDisabled ? <LockIcon /> : <AtSignIcon />,
      })
    }

    return items
  }, [guildData.roles])

  return (
    <Combobox>
      <ComboboxTrigger disabled={disabled}>
        <ComboboxValue placeholder={placeholder} />
      </ComboboxTrigger>
      <ComboboxContent items={items} {...props} />
    </Combobox>
  )
}
