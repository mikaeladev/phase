import "~/styles/globals.css"

import siteConfig from "@repo/config/site/www/index.ts"
import { Analytics } from "@vercel/analytics/react"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans"

import { cn } from "~/lib/utils"

import type { LayoutProps } from "~/types/props"
import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.title, template: `%s - ${siteConfig.title}` },
  description: siteConfig.description,
  authors: siteConfig.developer,
  creator: siteConfig.developer.name,
  keywords: siteConfig.keywords,
  icons: {
    apple: siteConfig.images.apple.toString(),
  },
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    type: "website",
    locale: "en_GB",
    images: {
      url: siteConfig.images.logo.toString(),
      width: 512,
      height: 512,
      alt: siteConfig.title,
    },
  },
  twitter: {
    card: "summary",
    title: siteConfig.title,
    description: siteConfig.description,
    images: siteConfig.images.logo.toString(),
  },
} satisfies Metadata

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#f8f8f8", // used in rich embeds
} satisfies Viewport

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html
      lang="en"
      className={cn(
        "bg-background text-foreground scheme-dark",
        GeistSans.variable,
        GeistMono.variable,
      )}
    >
      <body className="font-sans tracking-tighter antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
