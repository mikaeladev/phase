"use client"

import { usePathname } from "next/navigation"

import { Icon } from "@repo/ui/icon"
import { labelVariants } from "@repo/ui/label"
import { Link, linkVariants } from "~/components/link"

import { cn } from "~/lib/utils"

import type { NavItem } from "~/config/nav"
import type { WithRequired } from "~/types/utils"

// navigation //

export interface DashboardNavigationProps {
  pages: NavItem[]
}

export function DashboardNavigation(props: DashboardNavigationProps) {
  const iconNavItems = props.pages.filter(
    (item): item is WithRequired<NavItem, "icon"> => !!item.icon,
  )

  const categorisedNavItems = props.pages.filter(
    (item): item is WithRequired<NavItem, "category"> => !!item.category,
  )

  const categories = Object.entries(
    categorisedNavItems.reduce<Record<string, NavItem[]>>((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category]!.push(item)
      return acc
    }, {}),
  )

  const pathname = usePathname()
  const guildId = pathname.split("/")[2]

  return (
    <nav className="sm:flex sm:h-screen sm:min-w-[20rem] sm:flex-col sm:justify-between sm:border-r sm:p-12">
      <div className="hidden sm:block sm:space-y-12">
        <h3 className="text-4xl font-bold leading-none tracking-tighter">
          Phase
        </h3>
        <div className="space-y-1.5">
          {iconNavItems.map((item) => {
            let disabled = item.disabled
            let href = item.href

            if (item.href.includes("[id]")) {
              if (!guildId) disabled = true
              else href = item.href.replace("[id]", guildId)
            }

            return (
              <NavigationItem
                {...item}
                pathname={pathname}
                disabled={disabled}
                external={item.external}
                href={href}
                key={href}
              />
            )
          })}
        </div>
        {categories.map(([category, items]) => (
          <div key={category} className="flex flex-col space-y-1.5">
            <h4 className={cn(labelVariants(), "text-base uppercase")}>
              {category}
            </h4>
            {items.map((item) => (
              <NavigationItem key={item.href} pathname={pathname} {...item} />
            ))}
          </div>
        ))}
      </div>
      <div className="text-muted-foreground before:bg-foreground relative hidden flex-col font-mono text-sm saturate-0 before:absolute before:-left-4 before:h-full before:w-1 before:rounded-l-sm sm:flex">
        <span>
          Made with ❤ by{" "}
          <Link href={"/redirect/developer"} external>
            mikaela.
          </Link>
        </span>
        <span>
          Source code is on{" "}
          <Link href={"/redirect/github"} external>
            GitHub.
          </Link>
        </span>
      </div>
      <div className="bg-background text-muted-foreground before:from-background relative flex w-screen justify-evenly border-t py-5 before:absolute before:top-[-25px] before:h-6 before:w-full before:bg-gradient-to-t before:to-transparent sm:hidden">
        {iconNavItems.map((item) => {
          let disabled = item.disabled
          let href = item.href

          if (item.href.includes("[id]")) {
            if (!guildId) disabled = true
            else href = item.href.replace("[id]", guildId)
          }

          return (
            <NavigationItem
              {...item}
              pathname={pathname}
              disabled={disabled}
              external={item.external}
              href={href}
              key={href}
              mobile
            />
          )
        })}
      </div>
    </nav>
  )
}

// navigation item //

interface NavigationItemProps extends NavItem {
  pathname: string
  mobile?: boolean
}

function NavigationItem(props: NavigationItemProps) {
  if (!props.icon && props.mobile) return null

  const className = cn(
    props.icon
      ? [
          "before:bg-primary relative flex before:absolute before:rounded-full before:opacity-0 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-selected:before:opacity-100",
          props.mobile
            ? "aria-selected:text-foreground justify-center before:-bottom-3 before:z-10 before:h-1 before:w-3.5"
            : "aria-selected:text-primary-foreground w-full items-center gap-2.5 py-2.5 before:-left-5 before:h-full before:w-[calc(100%+2.5rem)]",
        ]
      : [linkVariants({ variant: "hover", size: "base" }), "font-normal"],
  )

  const onClick = (e: React.MouseEvent) => {
    if (props.disabled) e.preventDefault()
  }

  return (
    <Link
      href={props.href}
      label={props.label}
      external={props.external}
      disabled={props.disabled}
      variant={"no-underline"}
      className={className}
      onClick={onClick}
      aria-selected={props.pathname === props.href}
      aria-disabled={props.disabled}
    >
      {props.icon && (
        <Icon
          icon={props.icon}
          className={cn(props.mobile ? "size-7 duration-200" : "z-10 size-6")}
        />
      )}
      <span
        className={cn(
          props.icon && "relative z-10 text-lg font-medium leading-none",
          props.mobile && "sr-only",
        )}
      >
        {props.label}
      </span>
    </Link>
  )
}
