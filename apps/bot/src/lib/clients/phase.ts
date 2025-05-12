import { BotClient } from "@phasejs/core"
import { logsPlugin } from "@phasejs/logs"
import { storesPlugin } from "@phasejs/stores"

import { blacklistPlugin } from "@plugin/blacklist"
import { musicPlugin } from "@plugin/music"
import { voicePlugin } from "@plugin/voice"

import { blacklistConfig } from "~/lib/blacklist"
import { discordClient } from "~/lib/clients/discord"
import { emojiSyncPlugin } from "~/lib/emojis"
import { logsConfig } from "~/lib/logs"
import { storesConfig } from "~/lib/stores"
import { trpcPlugin } from "~/lib/trpc"

import { contextCreators } from "~/context"

export const phaseClient = new BotClient(discordClient, {
  contextCreators,
  plugins: [
    logsPlugin(logsConfig),
    storesPlugin(storesConfig),
    blacklistPlugin(blacklistConfig),
    emojiSyncPlugin(),
    voicePlugin(),
    musicPlugin(),
    trpcPlugin(),
  ],
})
