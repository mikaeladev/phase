import wwwConfig from "@repo/config/site/www/index.ts"

import type { NextConfig } from "next"

const protocolRegex = /^https?:\/\//
const proxyOrigin = wwwConfig.url.replace(protocolRegex, "")

export default {
  transpilePackages: ["@repo/ui"],
  basePath: "/dashboard",
  experimental: {
    serverActions: {
      allowedOrigins: [proxyOrigin],
    },
  },
} satisfies NextConfig
