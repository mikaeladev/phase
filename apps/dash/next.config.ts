import { env } from "~/lib/env"

import type { NextConfig } from "next"

export default {
  transpilePackages: ["@repo/ui"],
  basePath: "/dashboard",
  experimental: {
    serverActions: {
      allowedOrigins: [env.NEXT_PUBLIC_BASE_URL],
    },
  },
} satisfies NextConfig
