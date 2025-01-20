/* eslint-disable @typescript-eslint/consistent-indexed-object-style */

import type {} from "react"

declare module "react" {
  // add css variable support
  interface CSSProperties {
    [key: `--${string}`]: string | number
  }
}
