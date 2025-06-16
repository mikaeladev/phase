"use server"

import { createClient } from "@repo/trpc/client"

import { env } from "~/lib/env"

type TRPCClient = ReturnType<typeof createClient>
type BugReportInput = Parameters<TRPCClient["createBugReport"]["mutate"]>[0]

export async function createBugReport(input: BugReportInput) {
  const client = createClient({
    url: env.TRPC_URL,
    auth: { token: env.TRPC_TOKEN },
  })

  return await client.createBugReport.mutate(input)
}
