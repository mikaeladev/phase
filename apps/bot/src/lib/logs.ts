import { version } from "../../package.json"

import type { LogsPluginOptions } from "@phasejs/logs"

export const logsConfig = {
  name: "Phase",
  version: version,
} satisfies LogsPluginOptions
