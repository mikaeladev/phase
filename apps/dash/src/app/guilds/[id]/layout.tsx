import { ClientOnly } from "~/components/client-only"
import { DashboardProvider } from "~/components/context"

import { getSession } from "~/lib/auth"
import { createClient } from "~/lib/trpc"

import type { DashboardData } from "~/types/dashboard"
import type { LayoutProps } from "~/types/props"

interface GuildLayoutProps extends LayoutProps {
  params: Promise<Record<"id", string>>
}

export default async function GuildLayout({
  params: paramsPromise,
  children,
}: GuildLayoutProps) {
  const params = await paramsPromise
  const session = await getSession()

  const client = createClient({ adminId: session.user.id, guildId: params.id })

  const dashboardData: DashboardData = {
    session,
    guild: client.guilds.getCurrent.query(),
  }

  return (
    <ClientOnly>
      <DashboardProvider value={dashboardData}>{children}</DashboardProvider>
    </ClientOnly>
  )
}
