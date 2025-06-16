import { NextRequest, NextResponse } from "next/server"

import { dash } from "@repo/env"
import { createClient } from "@repo/trpc/client"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import DiscordProvider from "next-auth/providers/discord"

import type { NextAuthResult, Profile, Session, User } from "next-auth"
import type { JWT } from "next-auth/jwt"

const env = dash()
const isProd = env.NEXT_PUBLIC_BASE_URL.startsWith("https")

const client = createClient({
  url: env.TRPC_URL,
  auth: { token: env.TRPC_TOKEN },
})

const nextAuth = NextAuth({
  basePath: "/dashboard/auth/internal",
  secret: env.AUTH_COOKIE_SECRET,
  cookies: {
    sessionToken: {
      options: {
        secure: isProd,
      },
    },
  },
  pages: {
    signIn: "/dashboard/auth/signin",
    error: "/dashboard/auth/error",
  },
  providers: [
    DiscordProvider({
      authorization: "https://discord.com/api/oauth2/authorize?scope=identify",
      clientId: env.DISCORD_ID,
      clientSecret: env.DISCORD_SECRET,
      profile(profile: Profile) {
        return { userId: profile.id! }
      },
    }),
    CredentialsProvider({
      id: "otp",
      name: "OTP",
      credentials: { code: {} },
      async authorize({ code }) {
        const error = new Error("Invalid code provided")

        if (typeof code !== "string") throw error
        const otpData = await client.auth.validateOTP.query({ code })
        if (!otpData) throw error

        return { userId: otpData.userId }
      },
    }),
  ],
  callbacks: {
    async jwt({ user, account, token, trigger }) {
      if (trigger === "signIn" && user?.userId) {
        token.userId = user.userId

        if (account?.access_token) {
          await client.auth.revokeToken.mutate({ token: account.access_token })
        }
      }

      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (!token.userId) {
        console.error("[Session] Missing user ID in JWT")
        return session
      }

      session.user = { id: token.userId }

      return session
    },
    authorized({ request, auth }) {
      const { method, url: urlString } = request
      const url = new URL(urlString)

      if (!auth?.user) {
        if (url.pathname === "/dashboard/auth/signin") {
          return NextResponse.next()
        }

        return method === "GET"
          ? NextResponse.redirect(new URL("/dashboard/auth/signin", url))
          : NextResponse.json("Missing user credentials", { status: 401 })
      }

      return true
    },
  },
})

export type {} from "~/types"

export type { JWT, Profile, Session, User }

export const auth: NextAuthResult["auth"] = nextAuth.auth
export const signIn: NextAuthResult["signIn"] = nextAuth.signIn
export const signOut: NextAuthResult["signOut"] = nextAuth.signOut

// base path bodge taken from here:
// https://github.com/nextauthjs/next-auth/discussions/12160

function rewriteRequest(request: NextRequest) {
  const { headers, nextUrl } = request
  const { protocol, host, pathname, search } = nextUrl

  const detectedHost = headers.get("x-forwarded-host") ?? host
  const detectedProtocol = headers.get("x-forwarded-proto") ?? protocol
  const _protocol = detectedProtocol.endsWith(":")
    ? detectedProtocol
    : detectedProtocol + ":"

  const url = new URL(
    `${_protocol}//${detectedHost}/dashboard${pathname}${search}`,
  )

  return new NextRequest(url, request)
}

export const handlers: NextAuthResult["handlers"] = {
  async GET(request) {
    return await nextAuth.handlers.GET(rewriteRequest(request))
  },
  async POST(request) {
    return await nextAuth.handlers.POST(rewriteRequest(request))
  },
}
