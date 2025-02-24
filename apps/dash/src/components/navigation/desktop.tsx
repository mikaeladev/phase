"use client"

import { usePathname } from "next/navigation"
import * as React from "react"

import { cn } from "@repo/utils/site"

import { Icon } from "@repo/ui/icon"
import { labelVariants } from "@repo/ui/label"
import { Link } from "~/components/link"

import { dashboardPagesByCategory, dashboardPagesWithIcons } from "~/config/nav"

const dashboardPagesByCategoryEntries = Object.entries(dashboardPagesByCategory)

export function DesktopNavigation() {
  const pathname = usePathname()
  const guildId = pathname.split("/")[2]

  const containerRef = React.useRef<HTMLDivElement>(null)
  const activeTabRef = React.useRef<HTMLAnchorElement>(null)

  React.useEffect(() => {
    const container = containerRef.current

    if (container) {
      const activeTabElement = activeTabRef.current

      if (activeTabElement) {
        const { offsetTop, offsetHeight } = activeTabElement

        const clipTop = offsetTop
        const clipBottom = offsetTop + offsetHeight

        container.style.clipPath = `inset(${Number(
          (clipTop / container.offsetHeight) * 100,
        ).toFixed()}% 0 ${Number(
          100 - (clipBottom / container.offsetHeight) * 100,
        ).toFixed()}% 0 round calc(infinity * 1px))`
      }
    }
  }, [pathname, activeTabRef, containerRef])

  return (
    <nav className="flex h-screen min-w-[20rem] flex-col justify-between border-r p-12">
      <div className="space-y-12">
        <h3 className="text-4xl leading-none font-bold">Phase</h3>

        <div className="relative -ml-5">
          <DesktopNavigationTabs
            pathname={pathname}
            guildId={guildId}
            activeTabRef={activeTabRef}
          />
          <div
            ref={containerRef}
            className="bg-foreground absolute inset-0 z-10 h-full overflow-hidden transition-[clip-path] ease-in-out [clip-path:inset(100%_0_100%_0)]"
            aria-hidden
          >
            <DesktopNavigationTabs
              pathname={pathname}
              guildId={guildId}
              activeTabRef={activeTabRef}
              isOverlay
            />
          </div>
        </div>

        {dashboardPagesByCategoryEntries.map(([category, items]) => (
          <ul key={category} className="flex flex-col space-y-1.5">
            <h4 className={cn(labelVariants(), "text-base uppercase")}>
              {category}
            </h4>
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  variant="hover"
                  size="base"
                  className="font-normal"
                  {...item}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        ))}
      </div>
      <div className="text-muted-foreground">
        <p>
          Made with ❤ by{" "}
          <Link href={"/redirect/developer"} external>
            mikaela.
          </Link>
        </p>

        <p>
          Source code is on{" "}
          <Link href={"/redirect/github"} external>
            GitHub.
          </Link>
        </p>
      </div>
    </nav>
  )
}

interface DesktopNavigationTabsProps {
  pathname: string
  guildId?: string
  activeTabRef: React.RefObject<HTMLAnchorElement | null>
  isOverlay?: boolean
}

function DesktopNavigationTabs(props: DesktopNavigationTabsProps) {
  return (
    <ul className="space-y-1.5">
      {dashboardPagesWithIcons.map((item) => {
        let disabled = item.disabled
        let href = item.href

        if (item.href.includes("[id]")) {
          if (!props.guildId) disabled = true
          else href = item.href.replace("[id]", props.guildId)
        }

        const ref =
          !props.isOverlay && href === props.pathname
            ? props.activeTabRef
            : null

        return (
          <li key={href}>
            <Link
              ref={ref}
              label={item.label}
              href={href}
              disabled={disabled}
              aria-disabled={disabled}
              variant="no-underline"
              className={cn(
                "flex items-center gap-2.5 p-2.5 px-5 transition-all aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
                props.isOverlay && "text-background",
              )}
            >
              <Icon icon={item.icon} className="size-6" />
              <span className="text-lg leading-none font-medium">
                {item.label}
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
