import { NotFound } from "@repo/ui/not-found"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Not Found",
  description: "The page you're looking for doesn't exist or has been moved.",
}

export default function NotFoundPage() {
  return (
    <div className="grid grow place-items-center">
      <NotFound />
    </div>
  )
}
