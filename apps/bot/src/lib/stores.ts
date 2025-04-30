import { ConfigStore } from "~/structures/stores/ConfigStore"
import { GuildStore } from "~/structures/stores/GuildStore"
import { InviteStore } from "~/structures/stores/InviteStore"
import { StreamerStore } from "~/structures/stores/StreamerStore"

import type { StoresPluginOptions } from "@phasejs/stores"

declare module "@phasejs/stores" {
  interface BotStores {
    config: ConfigStore
    guilds: GuildStore
    invites: InviteStore
    streamers: StreamerStore
  }
}

export const storesConfig = {
  stores: {
    config: ConfigStore,
    guilds: GuildStore,
    invites: InviteStore,
    streamers: StreamerStore,
  },
} satisfies StoresPluginOptions
