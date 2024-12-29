import type { APIUser } from "discord-api-types/v10"

import type {} from "next-auth"
import type {} from "next-auth/jwt"

declare module "next-auth" {
  interface User {
    userId: string
  }

  interface Profile extends APIUser {}

  interface Session {
    user: { id: string }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string
  }
}
