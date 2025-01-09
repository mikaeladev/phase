import type { NextConfig } from "next"

export default {
  transpilePackages: ["@repo/ui"],
  assetPrefix: "/dashboard-static",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/guilds",
        permanent: false,
      },
      {
        source: "/modules",
        destination: "/guilds",
        permanent: false,
      },
    ]
  },
} satisfies NextConfig
