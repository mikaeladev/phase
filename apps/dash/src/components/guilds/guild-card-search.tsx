"use client"

import { useQueryState } from "nuqs"

import { Icon } from "@repo/ui/icon"
import { Input } from "@repo/ui/input"
import { SearchIcon } from "@repo/ui/lucide-icon"

export function GuildCardSearch() {
  const [guildName, setGuildName] = useQueryState("name", {
    defaultValue: "",
    throttleMs: 500,
  })

  return (
    <div className="relative h-9 w-full">
      <Icon
        icon={<SearchIcon />}
        className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2"
      />
      <Input
        className="pl-9"
        placeholder="Search guilds..."
        value={guildName}
        onChange={setGuildName}
      />
    </div>
  )
}
