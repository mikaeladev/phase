/* eslint-disable @typescript-eslint/consistent-indexed-object-style */

import "@total-typescript/ts-reset"
import "react"

declare module "react" {
  // add css variable support
  interface CSSProperties {
    [key: `--${string}`]: string | number
  }
}
