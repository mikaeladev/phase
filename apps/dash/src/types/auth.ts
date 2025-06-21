import type { APIUser } from "discord-api-types/v10"
import type { Profile, Session, User } from "next-auth"
import type { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Profile extends APIUser {}

  interface Session {
    user: { id: string }
  }

  interface User {
    userId: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string
  }
}

export type { Profile, Session, User, JWT }
