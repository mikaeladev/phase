import { DashboardNavigation } from "~/components/navigation"

import { dashboardPages } from "~/config/nav"

import type { LayoutProps } from "~/types/props"

export default function Layout({ children }: LayoutProps) {
  return (
    <main className="flex h-screen w-screen flex-col-reverse sm:flex-row">
      <DashboardNavigation pages={dashboardPages} />
      <div className="relative h-full w-full overflow-auto p-6 sm:p-12">
        {children}
      </div>
    </main>
  )
}
