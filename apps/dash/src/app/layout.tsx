import "~/styles/globals.css"

import dashConfig from "@repo/config/site/dash/index.ts"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"
import { NuqsAdapter } from "nuqs/adapters/next/pages"

import { cn } from "~/lib/utils"

import type { LayoutProps } from "~/types/props"
import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  metadataBase: new URL(dashConfig.url),
  title: { default: dashConfig.title, template: `%s - ${dashConfig.title}` },
  description: dashConfig.description,
  authors: dashConfig.developer,
  creator: dashConfig.developer.name,
  keywords: dashConfig.keywords,
  icons: {
    apple: dashConfig.images.apple.toString(),
  },
  openGraph: {
    url: dashConfig.url,
    title: dashConfig.title,
    description: dashConfig.description,
    siteName: dashConfig.title,
    type: "website",
    locale: "en_GB",
    images: {
      url: dashConfig.images.logo.toString(),
      width: 512,
      height: 512,
      alt: dashConfig.title,
    },
  },
  twitter: {
    card: "summary",
    title: dashConfig.title,
    description: dashConfig.description,
    images: dashConfig.images.logo.toString(),
  },
} satisfies Metadata

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#f8f8f8", // used in rich embeds
} satisfies Viewport

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" style={{ colorScheme: "dark" }}>
      <body
        className={cn(
          "bg-background text-foreground font-sans tracking-tighter antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  )
}