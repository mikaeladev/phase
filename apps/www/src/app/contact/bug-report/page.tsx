import { use } from "react"

import { BugReportForm } from "~/app/contact/bug-report/form"
import { createBugReport } from "./actions"

import type { BugReportFormValues } from "~/app/contact/bug-report/form"

interface BugReportPageProps {
  searchParams: Promise<Partial<BugReportFormValues>>
}

export default function BugReportPage(props: BugReportPageProps) {
  const searchParams = use(props.searchParams)

  return (
    <>
      <div className="prose mb-12 text-pretty">
        <h1>Bug Report Form</h1>
        <p>
          Thank you so much for taking the time to fill out this form! These
          reports help us catch bugs faster and improve the bot for everyone.
        </p>
        <p className="text-muted-foreground/75 italic">
          Psst~ If you take a screenshot of yourself filling out this form and
          send it to us on Discord, we'll give you a special role! 🤍
        </p>
      </div>
      <BugReportForm action={createBugReport} defaultValues={searchParams} />
    </>
  )
}
