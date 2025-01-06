import { NextResponse } from "next/server"

import siteConfig from "@repo/config/site/www/index.ts"
import { authjs, discord, mergeEnvs } from "@repo/env"
import { client } from "@repo/trpc/client"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import DiscordProvider from "next-auth/providers/discord"

import type { NextAuthResult, Profile, Session } from "next-auth"
import type { JWT } from "next-auth/jwt"

const env = mergeEnvs(authjs(), discord())

const nextAuth = NextAuth({
  secret: env.AUTH_COOKIE_SECRET,
  cookies: {
    sessionToken: {
      options: {
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
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
      const { method, nextUrl } = request
      const { pathname } = nextUrl

      if (!auth?.user) {
        if (pathname === "/auth/signin") {
          return NextResponse.next()
        }

        return method === "GET"
          ? NextResponse.redirect(`${siteConfig.url}/auth/signin`)
          : NextResponse.json("Missing user credentials", { status: 401 })
      }

      return true
    },
  },
})

// exports //

export type * from "~/types"

export const auth: NextAuthResult["auth"] = nextAuth.auth
export const signIn: NextAuthResult["signIn"] = nextAuth.signIn
export const signOut: NextAuthResult["signOut"] = nextAuth.signOut
export const handlers: NextAuthResult["handlers"] = nextAuth.handlers
