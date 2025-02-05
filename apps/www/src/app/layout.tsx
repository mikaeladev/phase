import "~/styles/globals.css"

import config from "@repo/config/site/www"
import { cn } from "@repo/utils/site"
import { Analytics } from "@vercel/analytics/react"
/* eslint-disable import-x/no-unresolved */
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"

import { Footer } from "~/components/footer"
import { Header } from "~/components/header"

/* eslint-enable import-x/no-unresolved */

import type { LayoutProps } from "~/types/props"
import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  metadataBase: new URL(config.url),
  title: {
    default: config.title,
    template: `%s - ${config.title}`,
  },
  description: config.description,
  authors: config.developer,
  creator: config.developer.name,
  keywords: config.keywords,
  icons: {
    icon: config.images.favicon,
    apple: config.images.apple,
    shortcut: config.images.logo,
  },
  openGraph: {
    url: config.url,
    title: config.title,
    description: config.description,
    siteName: config.title,
    type: "website",
    locale: "en_GB",
    images: {
      url: config.images.logo,
      alt: config.title,
      width: 512,
      height: 512,
    },
  },
  twitter: {
    card: "summary",
    title: config.title,
    description: config.description,
    images: config.images.logo,
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
