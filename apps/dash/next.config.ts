import type { NextConfig } from "next"

export default {
  transpilePackages: ["@repo/ui"],
  basePath: "/dashboard",
} satisfies NextConfig
