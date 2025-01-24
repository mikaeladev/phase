import "~/lib/env"

import www from "@repo/config/site/www/index.ts"

import type { NextConfig } from "next"

export default {
  transpilePackages: ["@repo/ui"],
  basePath: "/dashboard",
  experimental: {
    serverActions: {
      allowedOrigins: [www.url],
    },
  },
} satisfies NextConfig
