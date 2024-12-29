import type { MiddlewareConfig } from "next/server"

export const config: MiddlewareConfig = {
  matcher: ["/auth/:path*"],
}

export { auth as middleware } from "@repo/auth"
