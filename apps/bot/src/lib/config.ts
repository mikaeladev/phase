import { GatewayIntentBits, Options, Partials } from "discord.js"

import { Emojis } from "~/lib/emojis"

import { version } from "~/../package.json"

import type { ClientOptions } from "discord.js"

export interface BotConfig extends ClientOptions {
  name: string
  version: string
}

export const botConfig = {
  name: "Phase",
  version: version,
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [
    Partials.Channel,
    Partials.GuildMember,
    Partials.Message,
    Partials.Reaction,
    Partials.User,
  ],
  sweepers: {
    ...Options.DefaultSweeperSettings,
    messages: {
      interval: 60 * 60,
      lifetime: 60 * 30,
    },
  },
  makeCache: Options.cacheWithLimits({
    ...Options.DefaultMakeCacheSettings,
    ReactionManager: {
      maxSize: 0,
      keepOverLimit: (reaction) => {
        const reactionsToKeep = [Emojis.GiveawayReaction]
        return !!(
          reaction.me &&
          reaction.emoji.name &&
          reactionsToKeep.includes(reaction.emoji.name)
        )
      },
    },
  }),
} as const satisfies BotConfig
