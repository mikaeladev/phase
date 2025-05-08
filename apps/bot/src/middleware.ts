import { BotErrorMessage } from "~/structures/BotError"

import type { BotCommandMiddleware } from "@phasejs/core"

export async function commands(...params: Parameters<BotCommandMiddleware>) {
  const [interaction, context, execute] = params
  const { phase, command } = context

  const fullCommandName = phase.commands.resolveName(command)

  // to make code a little more DRY
  const unknownErr = (error: Error) => {
    console.log(error)

    const errorMsg = BotErrorMessage.unknown({
      commandName: fullCommandName,
      guildId: interaction.guild?.id,
      channelId: interaction.channel?.id,
      error,
    })

    if (interaction.deferred || interaction.replied) {
      void interaction.editReply(errorMsg)
    } else {
      void interaction.reply(errorMsg)
    }
  }

  // if the user is in a guild
  if (interaction.inGuild()) {
    const commandName = phase.commands.resolveName(command)
    const guildDoc = phase.stores.guilds.get(interaction.guildId)

    if (!interaction.inCachedGuild()) {
      // this won't happen until we start sharding the bot,
      // for now it's just for type safety
      const error = new Error("Guild not cached: " + interaction.guildId)
      return unknownErr(error)
    }

    if (!interaction.channel) {
      // for type safety again (djs fix ur types pls)
      const error = new Error("Channel not cached: " + interaction.channelId)
      return unknownErr(error)
    }

    if (!guildDoc) {
      // somethings properly wrong if this happens
      const error = new Error("Guild not found in DB: " + interaction.guildId)
      return unknownErr(error)
    }

    const { requiredBotPermissions, requiredUserPermissions } = command.metadata

    // this is somewhat half-implemented and a bit of a relic from v2,
    // the db structure has changed over time and this is a bit of a mess,
    // a more robust implementation will be added in v4, but this'll do for now
    const requiredUserPermissionsOverride =
      guildDoc.commands instanceof Map
        ? guildDoc.commands.get(commandName)
        : undefined

    if (requiredUserPermissionsOverride?.disabled) {
      return void interaction.reply(
        new BotErrorMessage("This command has been disabled in this server."),
      )
    }

    // makes sure the bot has the required permissions
    if (requiredBotPermissions) {
      const botMember =
        interaction.guild.members.me ??
        (await interaction.guild.members.fetchMe({ cache: true }))

      const botMemberPerms = interaction.channel.permissionsFor(botMember)
      const missingPerms = botMemberPerms.missing(requiredBotPermissions)

      if (missingPerms.length) {
        return void interaction.reply(
          // todo: update botMissingPermission to take an array of permissions
          BotErrorMessage.botMissingPermission(missingPerms[0], true),
        )
      }
    }

    // makes sure the user has the required permissions
    if (requiredUserPermissions || requiredUserPermissionsOverride) {
      const user = interaction.member

      const userIdOverride = `user:${user.id}`
      const userRoleOverrides = user.roles.cache.map(({ id }) => `role:${id}`)

      // explicitly allowing overrides everything
      const isExplicitlyAllowed = requiredUserPermissionsOverride?.allow.some(
        (override) => {
          if (override.startsWith("user:")) return override === userIdOverride
          if (override.startsWith("role:"))
            return userRoleOverrides.includes(override)
        },
      )

      // explicitly denying overrides default required permissions
      const isExplicitlyDenied = requiredUserPermissionsOverride?.deny.some(
        (override) => {
          if (override.startsWith("user:")) return override === userIdOverride
          if (override.startsWith("role:"))
            return userRoleOverrides.includes(override)
        },
      )

      if (!isExplicitlyAllowed) {
        if (isExplicitlyDenied) {
          // todo: add a more descriptive error message
          return void interaction.reply(BotErrorMessage.userMissingPermission())
        }

        if (requiredUserPermissions) {
          const userPerms = interaction.channel.permissionsFor(user)
          const missingPerms = userPerms.missing(requiredUserPermissions)

          if (missingPerms.length) {
            return void interaction.reply(
              BotErrorMessage.userMissingPermission(missingPerms[0]),
            )
          }
        }
      }
    }
  }

  // if the user is not in a guild and the command is server-only
  else if (context.command.metadata.dmPermission === false) {
    return void interaction.reply(BotErrorMessage.serverOnlyCommand())
  }

  try {
    return await execute(interaction, context)
  } catch (error) {
    if (!Error.isError(error)) {
      throw error
    }

    return unknownErr(error)
  }
}
