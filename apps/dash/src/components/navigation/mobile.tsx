"use client"

import { usePathname } from "next/navigation"

import { Icon } from "@repo/ui/icon"
import { Link } from "~/components/link"

import { dashboardPagesWithIcons } from "~/config/nav"

export function MobileNavigation() {
  const pathname = usePathname()
  const guildId = pathname.split("/")[2]

  return (
    <nav className="w-screen border-t py-5">
      <ul className="relative flex justify-evenly">
        {dashboardPagesWithIcons.map((item) => {
          let disabled = item.disabled
          let href = item.href

          if (item.href.includes("[id]")) {
            if (!guildId) disabled = true
            else href = item.href.replace("[id]", guildId)
          }

          return (
            <li key={item.href}>
              <Link
                label={item.label}
                href={href}
                disabled={disabled}
                aria-disabled={disabled}
                data-active={href === pathname}
                variant="no-underline"
                className="text-muted-foreground data-[active='true']:text-foreground before:bg-foreground flex items-center justify-center transition-all before:absolute before:-bottom-3 before:z-10 before:h-1 before:w-3 before:rounded-full before:opacity-0 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 data-[active='true']:before:opacity-100"
              >
                <Icon icon={item.icon} className="size-6" />
                <span className="sr-only">{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
