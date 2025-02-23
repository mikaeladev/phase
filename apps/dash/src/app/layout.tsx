import "~/styles/globals.css"

import dashConfig from "@repo/config/site/dash"
/* eslint-disable import-x/no-unresolved */
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"
/* eslint-enable import-x/no-unresolved */
import { NuqsAdapter } from "nuqs/adapters/next/pages"

import { cn } from "~/lib/utils"

import type { LayoutProps } from "~/types/props"
import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  metadataBase: new URL(dashConfig.url),
  title: {
    default: dashConfig.title,
    template: `%s - ${dashConfig.title}`,
  },
  description: dashConfig.description,
  authors: dashConfig.developer,
  creator: dashConfig.developer.name,
  keywords: dashConfig.keywords,
  icons: {
    icon: dashConfig.images.favicon,
    apple: dashConfig.images.apple,
    shortcut: dashConfig.images.logo,
  },
  openGraph: {
    url: dashConfig.url,
    title: dashConfig.title,
    description: dashConfig.description,
    siteName: dashConfig.title,
    type: "website",
    locale: "en_GB",
    images: {
      url: dashConfig.images.logo,
      alt: dashConfig.title,
      width: 512,
      height: 512,
    },
  },
  twitter: {
    card: "summary",
    title: dashConfig.title,
    description: dashConfig.description,
    images: dashConfig.images.logo,
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
      <body className="font-sans tracking-tighter antialiased">
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  )
}
