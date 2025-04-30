import { constantFactory } from "~/lib/factories"

import type { BotContextCreators } from "~/types/context"

export const baseBotContextCreators: BotContextCreators = {
  commands: constantFactory({}),
  crons: constantFactory({}),
  events: constantFactory({}),
}

export { version } from "~/../package.json"
