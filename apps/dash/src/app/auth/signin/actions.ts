"use server"

import { signIn } from "@repo/auth"
import { z } from "@repo/utils/zod"

export async function signInWithDiscord() {
  await signIn("discord", { redirectTo: "/dashboard/guilds" })
}

export async function signInWithOTP(unsafeData: string) {
  const dataParseResult = z
    .string()
    .regex(/^[a-zA-Z0-9]{6}$/)
    .safeParse(unsafeData)

  if (dataParseResult.success) {
    await signIn("otp", { code: dataParseResult.data, redirect: false })
  } else {
    throw new Error("Invalid data")
  }
}
