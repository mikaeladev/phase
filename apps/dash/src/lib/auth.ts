import { NextResponse } from "next/server"

import { absoluteURL } from "@repo/utils/site"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import DiscordProvider from "next-auth/providers/discord"

import { env } from "~/lib/env"
import { createClient } from "~/lib/trpc"

import type { Profile, Session } from "next-auth"
import type { JWT } from "next-auth/jwt"

const isProduction = env.NEXT_PUBLIC_BASE_URL.startsWith("https")

const nextAuth = NextAuth({
  basePath: "/dashboard/auth/internal",
  secret: env.AUTH_COOKIE_SECRET,
  cookies: {
    sessionToken: {
      options: {
        secure: isProduction,
      },
    },
  },
  pages: {
    signIn: "/dashboard/auth/signin",
    error: "/dashboard/auth/error",
  },
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_ID,
      clientSecret: env.DISCORD_SECRET,
      authorization: {
        url: "https://discord.com/api/oauth2/authorize",
        params: {
          scope: "identify",
          redirect_url: absoluteURL(
            "/dashboard/auth/internal/callback/discord",
          ),
        },
      },
      profile(profile: Profile) {
        return { userId: profile.id! }
      },
    }),
    CredentialsProvider({
      id: "otp",
      name: "OTP",
      credentials: { code: {} },
      async authorize({ code }) {
        if (typeof code !== "string") throw new Error("Invalid code provided")

        const trpc = createClient({})
        const otpData = await trpc.auth.validateOTP.query({ code })

        if (!otpData) throw new Error("Invalid code provided")
        return { userId: otpData.userId }
      },
    }),
  ],
  callbacks: {
    async jwt({ user, account, token, trigger }) {
      if (trigger === "signIn" && user?.userId) {
        token.userId = user.userId

        if (account?.access_token) {
          const trpc = createClient({})
          await trpc.auth.revokeToken.mutate({ token: account.access_token })
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

export const { auth, signIn, signOut, handlers } = nextAuth

export async function getSession() {
  const session = await auth()
  if (!session) throw new Error("Not authenticated")
  return session
}
