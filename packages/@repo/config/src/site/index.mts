import { createSiteConfig } from "./config"

const port = process.env.PORT ?? "3000"

const baseURL =
  import.meta.env?.PUBLIC_BASE_URL ??
  process.env.PUBLIC_BASE_URL ??
  process.env.NEXT_PUBLIC_BASE_URL ??
  (process.env.SKIP_ENV_VALIDATION ? "http://localhost:3000" : undefined)

if (!baseURL) {
  throw new Error("Missing '{PUBLIC_PREFIX}_BASE_URL' environment variable")
}

const basePath =
  import.meta.env?.PUBLIC_BASE_PATH ??
  process.env.PUBLIC_BASE_PATH ??
  process.env.NEXT_PUBLIC_BASE_PATH

const siteConfig = createSiteConfig({ port, baseURL, basePath })

export default siteConfig
export { siteConfig }
