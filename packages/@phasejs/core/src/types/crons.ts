import type { BotCronContext } from "~/structures/BotCron"
import type { DjsClient } from "~/types/client"

export type BotCronPattern = string

export type BotCronExecute = (
  client: DjsClient<true>,
  context: BotCronContext,
) => void | Promise<void>
