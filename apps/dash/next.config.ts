import { siteConfig } from "@repo/config/site"

import type { NextConfig } from "next"

const protocolRegex = /^https?:\/\//
const proxyOrigin = siteConfig.baseUrl.replace(protocolRegex, "")

export default {
  transpilePackages: ["@repo/ui"],
  basePath: siteConfig.basePath,
  experimental: {
    serverActions: {
      allowedOrigins: [proxyOrigin],
    },
  },
} satisfies NextConfig
