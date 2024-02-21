"use client"

import Link, { type LinkProps } from "next/link"
import { useRouter, usePathname } from "next/navigation"

import { useState } from "react"

import {
  ArrowTopRightIcon,
  HamburgerMenuIcon,
  GitHubLogoIcon,
} from "@radix-ui/react-icons"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Moon } from "@/components/moon"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

import { DocsSearch } from "./docs-search"

import { siteConfig } from "@/config/site"
import { docsNavConfig } from "@/config/nav/docs"
import { cn } from "@/lib/utils"

import type { MainNavItem, SidebarNavItem } from "@/types/nav"

export const DocsHeader = () => {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-sm">
      <div className="mx-auto flex h-16 items-center px-8">
        <MainNav mainNav={docsNavConfig.mainNav} pathname={pathname} />
        <MobileNav
          mainNav={docsNavConfig.mainNav}
          pageNav={docsNavConfig.sidebarNav}
          pathname={pathname}
        />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <DocsSearch />
          </div>
          <nav className="flex items-center">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(buttonVariants({ variant: "ghost" }), "w-9 px-0")}
              >
                <GitHubLogoIcon className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export const MainNav = (props: {
  mainNav: MainNavItem[]
  pathname: string
}) => {
  return (
    <nav className="mr-8 hidden items-center space-x-4 md:flex lg:space-x-6">
      <Link href={"/"} className="mr-6 flex items-center space-x-2">
        <Moon className="h-5 w-5" />
        <span className="font-bold leading-tight">Phase Bot</span>
      </Link>
      {props.mainNav.map((item) => (
        <Link
          key={item.href}
          href={item.href!}
          className={cn(
            "hover:text-primary relative text-sm font-medium transition-colors",
            props.pathname !== item.href && "text-muted-foreground",
          )}
        >
          {item.title}
          {item.external && (
            <ArrowTopRightIcon
              shapeRendering="geometricPrecision"
              className="absolute -right-[12px] top-0.5 h-[9px] w-[9px]"
            />
          )}
        </Link>
      ))}
    </nav>
  )
}

export const MobileNav = (props: {
  mainNav: MainNavItem[]
  pageNav: SidebarNavItem[]
  pathname: string
}) => {
  const [open, setOpen] = useState(false)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant={"ghost"}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "mr-2 w-9 px-0 md:hidden",
          )}
        >
          <HamburgerMenuIcon className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <ScrollArea className="mx-auto h-[70vh] w-full max-w-sm px-6 py-10">
          <div className="flex flex-col gap-6">
            <DrawerHeader className="gap-3 pt-0">
              <DrawerTitle>
                <MobileLink
                  href={"/"}
                  onOpenChange={setOpen}
                  className="flex items-center justify-center space-x-3"
                >
                  <Moon className="h-8 w-8" />
                  <span className="text-2xl font-bold leading-tight">
                    Phase Bot
                  </span>
                </MobileLink>
              </DrawerTitle>
              <DrawerDescription className="text-center text-base">
                The all-in-one Discord Bot.
              </DrawerDescription>
            </DrawerHeader>
            <div className="mr-3 flex justify-between gap-3">
              {props.mainNav.map(
                (item) =>
                  item.href && (
                    <MobileLink
                      key={item.href}
                      href={item.href}
                      onOpenChange={setOpen}
                      className={cn(
                        props.pathname === item.href
                          ? "text-foreground"
                          : "text-muted-foreground",
                        "relative",
                      )}
                    >
                      {item.title}
                      {item.external && (
                        <ArrowTopRightIcon
                          shapeRendering="geometricPrecision"
                          className="absolute -right-[12px] top-0.5 h-[9px] w-[9px]"
                        />
                      )}
                    </MobileLink>
                  ),
              )}
            </div>
            <Separator />
            <div className="flex flex-col gap-8">
              {props.pageNav.map((item, index) => (
                <div key={index} className="flex flex-col gap-3">
                  <h4 className="font-medium">{item.title}</h4>
                  {item?.items?.length &&
                    item.items.map(
                      (item, index) =>
                        !item.disabled &&
                        (item.href ? (
                          <MobileLink
                            key={index}
                            href={item.href}
                            onOpenChange={setOpen}
                            className={"text-muted-foreground relative"}
                          >
                            {item.title}
                            {item.external && (
                              <ArrowTopRightIcon
                                shapeRendering="geometricPrecision"
                                className="absolute -right-[12px] top-0.5 h-[9px] w-[9px]"
                              />
                            )}
                          </MobileLink>
                        ) : (
                          <span key={index} className="relative">
                            {item.title}
                            {item.external && (
                              <ArrowTopRightIcon
                                shapeRendering="geometricPrecision"
                                className="absolute -right-[12px] top-0.5 h-[9px] w-[9px]"
                              />
                            )}
                          </span>
                        )),
                    )}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  )
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

const MobileLink = ({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) => {
  const router = useRouter()
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString())
        onOpenChange?.(false)
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  )
}