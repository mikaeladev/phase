import { cn } from "@repo/utils/site"

import { Footer } from "~/components/footer"
import { Header } from "~/components/header"

// header only //

export interface HeaderOnlyLayoutProps
  extends React.ComponentPropsWithRef<"main"> {}

export function HeaderOnlyLayout({
  className,
  ...props
}: HeaderOnlyLayoutProps) {
  return (
    <>
      <Header />
      <main className={cn("mt-16 grow", className)} {...props} />
    </>
  )
}

// header + footer //

export interface HeaderFooterLayoutProps
  extends React.ComponentPropsWithRef<"main"> {}

export function HeaderFooterLayout({
  className,
  ...props
}: HeaderFooterLayoutProps) {
  return (
    <>
      <Header />
      <main className={cn("my-16 grow", className)} {...props} />
      <Footer />
    </>
  )
}
