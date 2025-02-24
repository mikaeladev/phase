import { redirect } from "next/navigation"

import { auth } from "@repo/auth"
import { client } from "@repo/trpc/client"

import { ClientOnly } from "~/components/client-only"
import { DashboardProvider } from "~/components/context"

import type { DashboardData } from "~/types/dashboard"
import type { LayoutProps } from "~/types/props"

interface GuildLayoutProps extends LayoutProps {
  params: Promise<Record<"id", string>>
}

export default async function GuildLayout({
  params,
  children,
}: GuildLayoutProps) {
  const session = (await auth())!

  const guildId = (await params).id
  const adminId = session.user.id

  const guildDataPromise = client.guilds.getById
    .query({ guildId, adminId })
    .then((data) => {
      if (!data) redirect("/guilds")
      return data
    })

  const dashboardData: DashboardData = {
    session,
    guild: guildDataPromise,
  }

  return (
    <ClientOnly>
      <DashboardProvider value={dashboardData}>{children}</DashboardProvider>
    </ClientOnly>
  )
}
