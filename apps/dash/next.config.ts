import { env } from "~/lib/env"

import type { NextConfig } from "next"

export default {
  transpilePackages: ["@repo/ui"],
  basePath: "/dashboard",
  experimental: {
    serverActions: {
      // uses getter to allow linting in CI where env is not set
      get allowedOrigins() {
        const protocolRegex = /^https?:\/\//
        const proxyOrigin = env.NEXT_PUBLIC_BASE_URL.replace(protocolRegex, "")
        return [proxyOrigin]
      },
    },
  },
} satisfies NextConfig
