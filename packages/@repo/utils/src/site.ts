import { siteConfig } from "@repo/config/site"
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

export function absoluteURL(path: string, withBasePath = true) {
  const basePath = withBasePath ? siteConfig.basePath : ""
  const fullPath = basePath + (path.startsWith("/") ? path : `/${path}`)
  return new URL(fullPath, siteConfig.baseUrl).href
}

export { cva, type VariantProps } from "class-variance-authority"
