import Link from "next/link"

import { Button } from "@repo/ui/button"
import { LucideIcon } from "@repo/ui/lucide-icon"

export default function Page() {
  return (
    <>
      <div className="text-balance text-center">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Authorisation Failed
        </h1>
        <p className="text-muted-foreground mt-2 md:text-lg">
          The authorisation code we received was invalid. Try logging in again,
          and if the problem persists, please make a support ticket.
        </p>
      </div>
      <div className="w-72 space-y-4 md:w-[336px]">
        <Button size={"lg"} className="w-full gap-2" asChild>
          <Link href={"/auth/signin"}>
            <LucideIcon name="rotate-cw" />
            Attempt login again
          </Link>
        </Button>
        <Button variant="outline" size={"lg"} className="w-full gap-2" asChild>
          <Link href={"/redirect/discord"}>
            <LucideIcon name="message-circle-question" />
            Make a support ticket
          </Link>
        </Button>
      </div>
    </>
  )
}