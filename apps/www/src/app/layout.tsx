import "~/styles/globals.css"

import wwwConfig from "@repo/config/site/www"
import { cn } from "@repo/utils/site"
import { Analytics } from "@vercel/analytics/react"
/* eslint-disable import-x/no-unresolved */
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"

/* eslint-enable import-x/no-unresolved */

import { Footer } from "~/components/footer"
import { Header } from "~/components/header"

import type { LayoutProps } from "~/types/props"
import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  metadataBase: new URL(wwwConfig.url),
  title: {
    default: wwwConfig.title,
    template: `%s - ${wwwConfig.title}`,
  },
  description: wwwConfig.description,
  authors: wwwConfig.developer,
  creator: wwwConfig.developer.name,
  keywords: wwwConfig.keywords,
  icons: {
    icon: wwwConfig.images.favicon,
    apple: wwwConfig.images.apple,
    shortcut: wwwConfig.images.logo,
  },
  openGraph: {
    url: wwwConfig.url,
    title: wwwConfig.title,
    description: wwwConfig.description,
    siteName: wwwConfig.title,
    type: "website",
    locale: "en_GB",
    images: {
      url: wwwConfig.images.logo,
      alt: wwwConfig.title,
      width: 512,
      height: 512,
    },
  },
  twitter: {
    card: "summary",
    title: wwwConfig.title,
    description: wwwConfig.description,
    images: wwwConfig.images.logo,
  },
}

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#f8f8f8",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: LayoutProps) {
  const geistFonts = [GeistSans.variable, GeistMono.variable]

  return (
    <html
      lang="en"
      className={cn("bg-background text-foreground scheme-dark", geistFonts)}
    >
      <body className="flex min-h-screen flex-col font-sans tracking-tighter antialiased">
        <Header />
        <main className="my-16 flex grow flex-col">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
