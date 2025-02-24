import { Navigation } from "~/components/navigation"

import type { LayoutProps } from "~/types/props"

export default function Layout({ children }: LayoutProps) {
  return (
    <main className="flex h-screen w-screen flex-col-reverse sm:flex-row">
      <Navigation />
      <div className="relative h-full w-full overflow-auto p-6 sm:p-12">
        {children}
      </div>
    </main>
  )
}
