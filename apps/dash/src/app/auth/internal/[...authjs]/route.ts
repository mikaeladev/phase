import { NextRequest } from "next/server"

import { siteConfig } from "@repo/config/site"

import { handlers } from "~/lib/auth"

const basePath = siteConfig.basePath ?? ""

function rewriteRequest(request: NextRequest) {
  const { headers, nextUrl } = request
  const { protocol, host, pathname, search } = nextUrl

  const detectedHost = headers.get("x-forwarded-host") ?? host
  const detectedProtocol = headers.get("x-forwarded-proto") ?? protocol

  const _protocol = detectedProtocol.endsWith(":")
    ? detectedProtocol
    : detectedProtocol + ":"

  const url = new URL(
    _protocol + "//" + detectedHost + basePath + pathname + search,
  )

  return new NextRequest(url, request)
}

export async function GET(req: NextRequest) {
  return await handlers.GET(rewriteRequest(req))
}

export async function POST(req: NextRequest) {
  return await handlers.POST(rewriteRequest(req))
}
