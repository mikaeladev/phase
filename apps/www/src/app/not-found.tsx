import { NotFound } from "@repo/ui/not-found"
import { HeaderOnlyLayout } from "~/components/layouts"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Not Found",
  description: "The page you're looking for doesn't exist or has been moved.",
}

export default function NotFoundPage() {
  return (
    <HeaderOnlyLayout className="grid place-content-center">
      <NotFound />
    </HeaderOnlyLayout>
  )
}
