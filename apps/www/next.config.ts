import dashConfig from "@repo/config/site/dash/index.ts"
import docsConfig from "@repo/config/site/docs/index.ts"

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
        // dashboard oauth
        source: "/redirect/oauth",
        destination: `https://discord.com/api/oauth2/authorize?client_id=${env.DISCORD_ID}&response_type=code&scope=identify&redirect_uri=${env.BASE_URL}/dashboard/guilds`,
        permanent: false,
      },
      {
        // bot invite
        source: "/redirect/invite",
        destination: `https://discord.com/oauth2/authorize?client_id=${env.DISCORD_ID}&response_type=code&scope=bot%20applications.commands&permissions=17666911472`,
        permanent: false,
      },
      {
        // old donation redirect
        source: "/redirect/donate",
        destination: `${env.BASE_URL}/redirect/buymeacoffee`,
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
      {
        source: "/dashboard/:path*",
        destination: `${dashConfig.url}/:path*`,
      },
      {
        source: "/docs/:path*",
        destination: `${docsConfig.url}/:path*`,
      },
    ]
  },
} satisfies NextConfig
