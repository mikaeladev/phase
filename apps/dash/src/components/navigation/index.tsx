import { DesktopNavigation } from "~/components/navigation/desktop"
import { MobileNavigation } from "~/components/navigation/mobile"

export function Navigation() {
  return (
    <>
      <aside className="sm:hidden">
        <MobileNavigation />
      </aside>
      <aside className="hidden sm:block">
        <DesktopNavigation />
      </aside>
    </>
  )
}
