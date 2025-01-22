import { BotClient } from "@phasejs/core/client"
import { loadApp } from "@phasejs/loaders"
import { logsPlugin } from "@phasejs/logs"
import { Client } from "discord.js"

import { blacklistPlugin } from "@plugin/blacklist"
import { musicPlugin } from "@plugin/music"
import { voicePlugin } from "@plugin/voice"

import { blacklistOptions } from "~/lib/blacklist"
import { botConfig } from "~/lib/config"
import { emojiSyncPlugin } from "~/lib/emojis"
import { trpcPlugin } from "~/lib/trpc"

import { ConfigStore } from "~/structures/stores/ConfigStore"
import { GuildStore } from "~/structures/stores/GuildStore"
import { InviteStore } from "~/structures/stores/InviteStore"
import { StreamerStore } from "~/structures/stores/StreamerStore"

// create the underlying discord.js client
const djsClient = new Client(botConfig)

// create the phasejs client wrapper
const phaseClient = new BotClient(djsClient, {
  plugins: [
    logsPlugin(botConfig),
    voicePlugin(),
    musicPlugin(),
    blacklistPlugin(blacklistOptions),
    emojiSyncPlugin(),
    trpcPlugin(),
  ],
  stores: {
    config: new ConfigStore(),
    guilds: new GuildStore(),
    invites: new InviteStore(),
    streamers: new StreamerStore(),
  },
})

// start the client
const app = await loadApp(phaseClient)
await phaseClient.init(app)
