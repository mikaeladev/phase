import { ClientOnly } from "~/components/client-only"
import { DashboardNavigation } from "~/components/navigation"

import { dashboardPages } from "~/config/nav"

import type { LayoutProps } from "~/types/props"

export default function Layout({ children }: LayoutProps) {
  return (
    <main className="flex h-screen w-screen flex-col-reverse sm:flex-row">
      <ClientOnly>
        <DashboardNavigation pages={dashboardPages} />
      </ClientOnly>
      <div className="relative h-full w-full overflow-auto p-6 sm:p-12">
        {children}
      </div>
    </main>
  )
}
