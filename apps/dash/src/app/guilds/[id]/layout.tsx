import { redirect } from "next/navigation"

import { auth } from "@repo/auth"
import { client } from "@repo/trpc/client"

import { ClientOnly } from "~/components/client-only"
import { DashboardProvider } from "~/components/context"

import type { LayoutProps } from "~/types/props"

interface GuildLayoutProps extends LayoutProps {
  params: Promise<Record<"id", string>>
}

export default async function GuildLayout({
  params,
  children,
}: GuildLayoutProps) {
  const session = (await auth())!

  const userId = session.user.id
  const guildId = (await params).id

  const guildData = await client.guilds.getById.query({
    guildId,
    adminId: userId,
  })

  if (!guildData) {
    redirect("/guilds")
  }

  return (
    <ClientOnly>
      <DashboardProvider value={{ guild: guildData }}>
        {children}
      </DashboardProvider>
    </ClientOnly>
  )
}
