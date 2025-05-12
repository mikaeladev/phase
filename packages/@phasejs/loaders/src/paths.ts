import { async as glob } from "fast-glob"

import { regexFilterPatterns } from "~/lib/constants"
import { regexFilter, resolveRootDir } from "~/lib/utils"

import type { AppConfig, AppPaths } from "~/types/app"

export async function getAppPaths(config: AppConfig): Promise<AppPaths> {
  const rootDir = resolveRootDir(config)

  const extnamePattern = ".@(js|cjs|mjs|ts|cts|mts)"
  const globOptions = { cwd: rootDir, absolute: true }

  const prestartPaths = glob("prestart" + extnamePattern, globOptions)
  const middlewarePaths = glob("middleware" + extnamePattern, globOptions)

  const commandPaths = glob("app/commands/**/*" + extnamePattern, globOptions)
  const cronPaths = glob("app/crons/**/*" + extnamePattern, globOptions)
  const eventPaths = glob("app/events/**/*" + extnamePattern, globOptions)

  const paths = await Promise.all([
    prestartPaths,
    middlewarePaths,
    commandPaths,
    cronPaths,
    eventPaths,
  ])

  return {
    prestart: paths[0][0],
    middlewares: paths[1][0],
    commands: paths[2].filter(regexFilter(regexFilterPatterns.command)),
    crons: paths[3].filter(regexFilter(regexFilterPatterns.cron)),
    events: paths[4].filter(regexFilter(regexFilterPatterns.event)),
  }
}
