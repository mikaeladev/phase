import wwwConfig from "@repo/config/site/www/index.ts"
import { clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

import type { ClassValue } from "clsx"

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      shadow: [
        {
          "shadow-glow": ["sm", "md", "lg"],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteURL(path: string, includeMFEBase = true) {
  const basePathname = includeMFEBase ? mfeBase() : ""
  return new URL(`${basePathname}/${path}`, wwwConfig.url).href
}

export function mfeName() {
  const cwd = process.cwd().replace(/\\/g, "/")
  const app = cwd.split("/apps/")[1]?.split("/")[0]

  if (!app) throw new Error(`Could not determine app name from cwd '${cwd}'`)
  if (app === "bot") throw new Error(`This app is not a MFE`)

  return app
}

export function mfeBase() {
  return {
    www: "/",
    docs: "/docs",
    dash: "/dashboard",
  }[mfeName()]
}

export { cva, type VariantProps } from "class-variance-authority"
