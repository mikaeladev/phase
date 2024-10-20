import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

const BASE_URL =
  process.env.VERCEL_ENV === "production"
    ? "https://phasebot.xyz"
    : process.env.VERCEL_ENV === "preview"
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"

export function shared() {
  return createEnv({
    emptyStringAsUndefined: true,
    runtimeEnv: process.env,
    server: {
      // environment
      NODE_ENV: z.enum(["development", "test", "production"]),
      BASE_URL: z.string().url().default(BASE_URL),
      // database
      MONGODB_URI: z.string(),
      POSTGRES_URI: z.string(),
      // discord
      DISCORD_TOKEN: z.string(),
      DISCORD_SECRET: z.string(),
      DISCORD_ID: z.string(),
      // twitch
      TWITCH_CLIENT_SECRET: z.string(),
      TWITCH_CLIENT_ID: z.string(),
      // auth
      AUTH_COOKIE_SECRET: z.string(),
      AUTH_OTP_SECRET: z.string(),
      // webhook
      WEBHOOK_ALERT: z.string(),
    },
  })
}