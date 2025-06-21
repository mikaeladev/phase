import "~/styles/globals.css"

import { siteConfig } from "@repo/config/site"
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
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s - ${siteConfig.title}`,
  },
  description: siteConfig.description,
  authors: siteConfig.developer,
  creator: siteConfig.developer.name,
  keywords: siteConfig.keywords,
  icons: {
    icon: siteConfig.images.favicon,
    apple: siteConfig.images.apple,
    shortcut: siteConfig.images.logo,
  },
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    type: "website",
    locale: "en_GB",
    images: {
      url: siteConfig.images.logo,
      alt: siteConfig.title,
      width: 512,
      height: 512,
    },
  },
  twitter: {
    card: "summary",
    title: siteConfig.title,
    description: siteConfig.description,
    images: siteConfig.images.logo,
  },
}

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  colorScheme: "dark",
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "#101010",
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: "#f8f8f8",
    },
  ],
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
