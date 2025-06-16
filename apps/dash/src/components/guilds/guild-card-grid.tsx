"use client"

import { useQueryState } from "nuqs"

import { GuildCard, GuildCardFallback } from "~/components/guilds/guild-card"

import type { TRPCGuild } from "@repo/trpc/client"

export interface GuildCardGridProps {
  guilds: TRPCGuild[]
}

export function GuildCardGrid(props: GuildCardGridProps) {
  const [guildName] = useQueryState("name")

  const filteredGuilds = guildName?.length
    ? props.guilds.filter((g) => g.name.toLowerCase().includes(guildName))
    : props.guilds

  return (
    <div className="grid grid-cols-[repeat(var(--column-count),minmax(0,1fr))] gap-4">
      {filteredGuilds.map((guild) => (
        <GuildCard key={guild.id} guild={guild} />
      ))}
    </div>
  )
}

export interface GuildCardGridFallbackProps {
  guilds: number
}

export function GuildCardGridFallback(props: GuildCardGridFallbackProps) {
  return (
    <div className="grid grid-cols-[repeat(var(--column-count),minmax(0,1fr))] gap-4">
      {Array.from({ length: props.guilds }).map((_, index) => (
        <GuildCardFallback key={index} />
      ))}
    </div>
  )
}
