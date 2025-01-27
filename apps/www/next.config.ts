import { env } from "~/lib/env"

import type { NextConfig } from "next"

export default {
  transpilePackages: ["@repo/ui"],
  async redirects() {
    return [
      {
        // discord server
        source: "/redirect/discord",
        destination: "https://discord.com/invite/mZjRBKS29X",
        permanent: false,
      },
      {
        // bot invite
        source: "/redirect/invite",
        destination:
          "https://discord.com/oauth2/authorize?client_id=1078305837245796483&response_type=code&scope=bot%20applications.commands&permissions=17666911472",
        permanent: false,
      },
      {
        // old donation redirect
        source: "/redirect/donate",
        destination: `${env.NEXT_PUBLIC_BASE_URL}/redirect/buymeacoffee`,
        permanent: false,
      },
      {
        // donation page 1
        source: "/redirect/buymeacoffee",
        destination: "https://www.buymeacoffee.com/mikaeladev",
        permanent: false,
      },
      {
        // donation page 2
        source: "/redirect/ko-fi",
        destination: "https://ko-fi.com/mikaelareid",
        permanent: false,
      },
      {
        // developer page
        source: "/redirect/developer",
        destination: "https://github.com/mikaeladev",
        permanent: false,
      },
      {
        // github repo
        source: "/redirect/github",
        destination: "https://github.com/mikaeladev/phase",
        permanent: false,
      },
      {
        // terms page
        source: "/terms",
        destination: "/docs/terms",
        permanent: false,
      },
      {
        // privacy page
        source: "/privacy",
        destination: "/docs/privacy",
        permanent: false,
      },
    ]
  },
  async rewrites() {
    return [
      // dashboard mfe
      {
        source: "/dashboard",
        destination: `${env.DASH_URL}`,
      },
      {
        source: "/dashboard/:path*",
        destination: `${env.DASH_URL}/:path*`,
      },
      // documentation mfe
      {
        source: "/docs",
        destination: `${env.DOCS_URL}`,
      },
      {
        source: "/docs/:path*",
        destination: `${env.DOCS_URL}/:path*`,
      },
    ]
  },
} satisfies NextConfig
