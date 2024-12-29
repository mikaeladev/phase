import siteConfig from "@repo/config/site/www/index.ts"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import type { ClassValue } from "clsx"

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const absoluteURL = (path: string) => siteConfig.url + path
