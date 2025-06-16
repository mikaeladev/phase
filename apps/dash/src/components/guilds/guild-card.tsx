"use client"

import Link from "next/link"

import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar"
import { Card, CardHeader, CardTitle } from "@repo/ui/card"
import { Skeleton } from "@repo/ui/skeleton"

import type { TRPCGuild } from "@repo/trpc/client"

export interface GuildCardProps {
  guild: TRPCGuild
}

export function GuildCard(props: GuildCardProps) {
  return (
    <Card className="hover:border-muted-foreground relative transition-colors">
      <Link
        href={`/guilds/${props.guild.id}/modules`}
        className="focus-visible:ring-ring absolute top-0 left-0 h-full w-full focus-visible:ring-1 focus-visible:outline-hidden"
      />
      <div className="flex flex-row items-center gap-4 p-6">
        <Avatar className="h-12 w-12 rounded-md border">
          <AvatarImage src={props.guild.iconURL ?? undefined} />
          <AvatarFallback className="rounded-none">
            {props.guild.nameAcronym}
          </AvatarFallback>
        </Avatar>
        <CardHeader className="p-0">
          <CardTitle className="line-clamp-1">{props.guild.name}</CardTitle>
          <div className="text-muted-foreground flex gap-3 text-sm">
            <div className="inline-flex items-center space-x-1">
              <div className="bg-muted-foreground my-auto inline-block size-3 rounded-full" />
              <span>{props.guild.memberCount} Members</span>
            </div>
            <div className="inline-flex items-center space-x-1">
              <div className="inline-block size-3 rounded-full bg-green-300" />
              <span>{props.guild.presenceCount ?? "?"} Online</span>
            </div>
          </div>
        </CardHeader>
      </div>
    </Card>
  )
}

export function GuildCardFallback() {
  return (
    <Card>
      <div className="flex flex-row items-center gap-4 p-6">
        <Skeleton className="size-12" />
        <CardHeader className="p-0">
          <Skeleton className="h-4 w-40" />
          <div className="flex gap-3">
            <div className="inline-flex space-x-1">
              <Skeleton className="inline-block size-3" />
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="inline-flex space-x-1">
              <Skeleton className="inline-block size-3" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </CardHeader>
      </div>
    </Card>
  )
}
