import { cn } from "@repo/utils/site"

import { Moon } from "~/components/moon"

export interface NotFoundProps
  extends Omit<React.ComponentPropsWithRef<"div">, "children"> {}

export function NotFound({ className, ...props }: NotFoundProps) {
  return (
    <div
      className={cn(
        "relative grid size-72 place-items-center sm:size-80 md:size-96",
        className,
      )}
      {...props}
    >
      <div className="animate-in fade-in-0 fill-mode-both absolute duration-1000 [animation-delay:2s]">
        <div className="text-center font-bold tracking-tighter">
          <h1 className="text-9xl">404</h1>
          <span className="text-3xl">Not Found</span>
        </div>
      </div>
      <Moon className="animate-moon-shrink size-full origin-center" />
      <MoonTwinkle className="animate-moon-twinkle absolute h-0 w-0 origin-center" />
    </div>
  )
}

function MoonTwinkle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="112"
      height="113"
      viewBox="0 0 112 113"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        className="fill-primary"
        d="M70.856 0.283691L70.3465 7.2993C69.0346 25.3657 86.6194 38.945 103.884 33.1978L110.589 30.966L104.758 34.9439C89.7434 45.1876 90.0366 67.3329 105.317 77.1796L111.251 81.0032L104.49 78.948C87.079 73.6552 69.8598 87.6907 71.6496 105.716L72.3446 112.716L69.7442 106.175C63.0476 89.3319 41.2825 84.6885 28.2336 97.3196L23.1664 102.225L26.6849 96.1236C35.7455 80.4127 25.8239 60.5871 7.76248 58.3121L0.748779 57.4286L7.73665 56.3617C25.7316 53.6141 35.1248 33.5352 25.6514 18.0672L21.9726 12.0606L27.1679 16.8311C40.5467 29.1159 62.1813 23.9036 68.4296 6.89035L70.856 0.283691Z"
      />
    </svg>
  )
}
