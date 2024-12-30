"use server"

import { client } from "@repo/trpc/client"

type BugReportInput = Parameters<typeof client.createBugReport.mutate>[0]

export async function createBugReport(input: BugReportInput) {
  return await client.createBugReport.mutate(input)
}
