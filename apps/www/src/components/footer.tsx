import { cn } from "@repo/utils/site"

import { Link } from "~/components/link"

export interface FooterProps extends React.ComponentPropsWithRef<"footer"> {}

export function Footer({ className, ...props }: FooterProps) {
  return (
    <footer className={cn("relative h-0 w-screen", className)} {...props}>
      <div className="absolute bottom-0 h-16 w-full sm:border-t sm:backdrop-blur-xs">
        <div className="container flex h-full items-center py-6 sm:py-0">
          <p className="text-muted-foreground w-full text-center text-xs leading-loose text-balance sm:text-left sm:text-sm">
            Built by{" "}
            <Link
              href={"/redirect/developer"}
              label="Developer profile"
              variant={"hover"}
              external
            >
              mikaela
            </Link>
            . Source code is available on{" "}
            <Link
              href={"/redirect/github"}
              label="Project repository"
              variant={"hover"}
              external
            >
              GitHub
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  )
}
