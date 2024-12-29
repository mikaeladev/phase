import type { NextConfig } from "next"

export default {
  transpilePackages: ["@repo/ui"],
  basePath: "/dashboard",
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
