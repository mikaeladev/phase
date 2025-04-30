import type { BaseBotKVStore } from "~/structures/BaseBotKVStore"
import type { BaseBotStore } from "~/structures/BaseBotStore"

export type BotStore = BaseBotStore | BaseBotKVStore
