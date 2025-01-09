import { Suspense } from "react"

import { auth } from "@repo/auth"
import { client } from "@repo/trpc/client"

import { Button } from "@repo/ui/button"
import { Icon } from "@repo/ui/icon"
import { PlusIcon } from "@repo/ui/lucide-icon"
import {
  GuildCardGrid,
  GuildCardGridFallback,
} from "~/components/guilds/guild-card-grid"
import { GuildCardSearch } from "~/components/guilds/guild-card-search"

import { absoluteURL } from "~/lib/utils"

export type DashboardGuild = Awaited<
  ReturnType<typeof client.guilds.getByAdminId.query>
>[number]

export default function GuildsPage() {
  return (
    <div className="[--column-count:1] lg:[--column-count:2] xl:[--column-count:3]">
      <div className="mb-8 grid w-full grid-cols-[repeat(var(--column-count),minmax(0,1fr))] gap-4">
        <h1 className="hidden text-3xl font-bold lg:block xl:col-span-2">
          Select a guild
        </h1>
        <div className="flex space-x-2">
          <GuildCardSearch />
          <Button className="gap-2" asChild>
            <a href={absoluteURL("/redirect/invite", false)}>
              <span className="hidden sm:inline">Add Guild</span>
              <span className="inline sm:hidden">Add</span>
              <Icon icon={<PlusIcon />} />
            </a>
          </Button>
        </div>
      </div>
      <Suspense fallback={<GuildCardGridFallback guilds={5} />}>
        {<GuildCards />}
      </Suspense>
    </div>
  )
}

async function GuildCards() {
  const session = (await auth())!

  const guilds = await client.guilds.getByAdminId.query({
    adminId: session.user.id,
  })

  return <GuildCardGrid guilds={guilds} />
}
