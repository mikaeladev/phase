import type { MiddlewareConfig } from "next/server"

export { auth as middleware } from "~/lib/auth"

export const config: MiddlewareConfig = {
  matcher: [
    /*
     * match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - auth/error (auth error page)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|auth/error).*)",
  ],
}
