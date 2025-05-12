import { buildBuilders } from "~/build"
import { getAppExports } from "~/exports"
import { getAppPaths } from "~/paths"

import type { BotClient } from "@phasejs/core"
import type { AppConfig, AppExports, AppInitParams } from "~/types/app"

export async function loadApp(
  phase: BotClient,
  config: AppConfig = {},
): Promise<AppInitParams> {
  const paths = await getAppPaths(config)
  const exports = await getAppExports(paths, config)
  return getAppInitParams(phase, exports)
}

export function getAppInitParams(
  phase: BotClient,
  exports: AppExports,
): AppInitParams {
  return {
    prestart: Object.values(exports.prestart)[0],
    middlewares: Object.values(exports.middlewares)[0],
    ...buildBuilders(phase, exports),
  }
}

export * from "~/lib/constants"
export * from "~/lib/utils"

export * from "~/build"
export * from "~/exports"
export * from "~/paths"

export type * from "~/types/app"
