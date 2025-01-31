"use client"

import { useCallback, useEffect, useState } from "react"

import { absoluteURL, cn, cva } from "@repo/utils/site"

import { Button } from "~/components/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/command"
import { Icon } from "~/components/icon"
import {
  ExternalLinkIcon,
  ScrollTextIcon,
  TelescopeIcon,
} from "~/components/lucide-icon"
import { Moon } from "~/components/moon"
import { DiscordIcon, GithubIcon } from "~/components/simple-icon"

import { useWithProps } from "~/hooks/use-with-props"

import type { VariantProps } from "@repo/utils/site"
import type { BaseLink, BaseLinkProps } from "~/components/base-link"
import type { With } from "~/types/utils"

// nav items //

const navItems: NavigationComboboxItem[] = [
  {
    label: "Home",
    href: "/",
    mfe: true,
  },
  {
    label: "Docs",
    href: "/docs",
    mfe: true,
  },
  {
    label: "Dashboard",
    href: "/dashboard/guilds",
    mfe: true,
  },
  {
    label: "Invite",
    href: "/redirect/invite",
    external: true,
  },
  {
    label: "Discord",
    href: "/redirect/discord",
    external: true,
    icon: <DiscordIcon />,
  },
  {
    label: "GitHub",
    href: "/redirect/github",
    external: true,
    icon: <GithubIcon />,
  },
].map((item) => ({ ...item, href: absoluteURL(item.href, false) }))

// header //

export const headerVariants = cva(
  "z-50 h-16 w-full border-b backdrop-blur-xs",
  {
    variants: {
      position: {
        fixed: "fixed top-0",
        sticky: "sticky top-0",
      },
    },
  },
)

export interface HeaderProps
  extends With<VariantProps<typeof headerVariants>, "position">,
    React.ComponentPropsWithRef<"header"> {
  link: typeof BaseLink
}

export function Header({
  className,
  position,
  link: Link,
  ...props
}: HeaderProps) {
  const HeaderLink = useHeaderLink(Link)

  return (
    <header className={cn(headerVariants({ position }), className)} {...props}>
      <div className="container flex h-full items-center">
        <div className="mr-6 hidden items-center gap-6 md:flex lg:mr-8">
          <Link
            href="/"
            label="Home"
            variant="no-underline"
            className="flex items-center space-x-2"
          >
            <Moon className="size-5" />
            <span className="font-bold">Phase</span>
          </Link>
          <nav className="flex items-center space-x-4 lg:space-x-6">
            {navItems
              .filter((item) => !item.icon)
              .map((item) => (
                <HeaderLink key={item.href} {...item} />
              ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-3 md:justify-end">
          <NavigationCombobox link={Link} items={navItems} />
          <nav className="flex items-center gap-1.5">
            {navItems
              .filter((i): i is NavigationComboboxItemWithIcon => !!i.icon)
              .map(({ icon, ...item }) => (
                <HeaderLink key={item.href} {...item} iconOnly>
                  <Icon icon={icon} />
                </HeaderLink>
              ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

// header link //

interface HeaderLinkProps extends Omit<BaseLinkProps, "variant" | "size"> {
  link: typeof BaseLink
  iconOnly?: boolean
}

function HeaderLink({
  link: Link,
  iconOnly,
  children,
  ...props
}: HeaderLinkProps) {
  return iconOnly ? (
    <Button variant={"outline"} size={"icon"} asChild>
      <Link {...props}>{children ?? props.label}</Link>
    </Button>
  ) : (
    <Link variant={"hover"} size={"sm"} {...props}>
      {children ?? props.label}
    </Link>
  )
}

function useHeaderLink(link: typeof BaseLink) {
  return useWithProps(HeaderLink, { link })
}

// navigation combobox //

interface NavigationComboboxItem {
  label: string
  href: string
  mfe?: boolean
  external?: boolean
  icon?: React.JSX.Element
}

type NavigationComboboxItemWithIcon = With<NavigationComboboxItem, "icon">

interface NavigationComboboxProps {
  link: typeof BaseLink
  items: NavigationComboboxItem[]
}

function NavigationCombobox({ link: Link, items }: NavigationComboboxProps) {
  const [open, setOpen] = useState(false)

  const toggleOpen = () => setOpen((open) => !open)

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (
      !((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") ||
      (e.target instanceof HTMLElement && e.target.isContentEditable) ||
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement
    ) {
      return
    }

    e.preventDefault()
    toggleOpen()
  }, [])

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [onKeyDown])

  return (
    <div className="w-full flex-1 md:w-auto md:flex-none">
      <Button
        aria-label="Navigation"
        aria-description="Navigate to a page"
        variant="outline"
        className="bg-background text-muted-foreground relative h-9 w-full justify-start text-sm md:w-64"
        onClick={toggleOpen}
      >
        <span className="flex items-center gap-2">
          <Icon className="size-3.5" icon={<TelescopeIcon />} />
          Wanna explore?
        </span>
        <kbd className="bg-muted pointer-events-none absolute top-1 right-1 hidden h-[calc(100%-8px)] items-center rounded-sm px-2.5 font-mono text-xs font-medium select-none sm:inline-flex">
          ⌘ K
        </kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        dialogLabel="Navigation"
        dialogDescription="Navigate to a page"
      >
        <CommandInput placeholder="Where do you want to go?" />
        <CommandList>
          <CommandEmpty>{"No results found :("}</CommandEmpty>
          <CommandGroup heading="Main Links">
            {items.map((item) => {
              const icon =
                item.icon ??
                (item.external ? <ExternalLinkIcon /> : <ScrollTextIcon />)

              return (
                <CommandItem key={item.href} value={item.label} asChild>
                  <Link variant="no-underline" onClick={toggleOpen} {...item}>
                    <Icon icon={icon} className="mr-2" />
                    {item.label}
                  </Link>
                </CommandItem>
              )
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  )
}
