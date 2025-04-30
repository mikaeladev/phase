import { Client, GatewayIntentBits, Options, Partials } from "discord.js"

import { Emojis } from "~/lib/emojis"

export const discordClient = new Client({
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
})
