import { ModuleId } from "@repo/utils/modules"

import type { GuildModules } from "@repo/db"
import type { ContextWithGuildAuth } from "~/server/context"
import type { GuildModulesWithExtraData } from "~/types/modules"
import type {
  TRPCGuild,
  TRPCGuildChannel,
  TRPCGuildMember,
  TRPCGuildRole,
} from "~/types/trpc"
import type { GuildMember, NonThreadGuildBasedChannel, Role } from "discord.js"

export function keys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[]
}

export function transformBotChannel(
  data: NonThreadGuildBasedChannel,
): TRPCGuildChannel {
  return {
    id: data.id,
    name: data.name,
    type: data.type,
    flags: data.flags.toJSON(),
    position: data.position,
    parentId: data.parentId,
    permissionOverwrites: data.permissionOverwrites.cache.map((overwrite) => ({
      id: overwrite.id,
      type: overwrite.type,
      allow: overwrite.allow.toJSON(),
      deny: overwrite.deny.toJSON(),
    })),
  }
}

export function transformBotRole(data: Role): TRPCGuildRole {
  return {
    id: data.id,
    name: data.name,
    color: data.color,
    position: data.position,
    permissions: data.permissions.toJSON(),
    flags: data.flags.toJSON(),
    isHoisted: data.hoist,
    isManaged: data.managed,
    isMentionable: data.mentionable,
  }
}

export function transformBotMember(
  data: GuildMember,
  ctx: ContextWithGuildAuth,
): TRPCGuildMember {
  const { guildDoc, guildAPI } = ctx.auth

  const isAdmin = guildDoc.admins.includes(data.id)
  const isOwner = guildAPI.ownerId === data.id

  return {
    id: data.id,
    username: data.user.username,
    displayName: data.displayName,
    avatarURL: data.displayAvatarURL({ size: 256 }),
    joinedAt: data.joinedAt!.toISOString(),
    isAdmin,
    isOwner,
  }
}

export function transformModuleConfig<T extends ModuleId>(
  id: T,
  config: Required<GuildModules>[T],
  ctx: ContextWithGuildAuth,
): Required<GuildModulesWithExtraData>[T] {
  if (id === ModuleId.TwitchNotifications) {
    const transformedConfig = {
      ...config,
    } as Required<GuildModulesWithExtraData>[ModuleId.TwitchNotifications]

    const streamerNames: Record<number, string> = {}

    for (let i = 0; i < transformedConfig.streamers.length; i++) {
      const id = transformedConfig.streamers[i]!.id
      const name = ctx.phase.stores.streamers.get(id)?.username
      if (name) streamerNames[i] = name
    }

    transformedConfig._data = { streamerNames }
    return transformedConfig as Required<GuildModulesWithExtraData>[T]
  }

  return config as Required<GuildModulesWithExtraData>[T]
}

export async function transformBotGuild(
  ctx: ContextWithGuildAuth,
): Promise<TRPCGuild> {
  const { guildDoc, guildAPI } = ctx.auth

  const admins = await fetchAdmins(ctx)

  const modules = Object.entries(guildDoc.modules ?? {}).reduce(
    (acc, [id, config]) => ({
      ...acc,
      [id]: transformModuleConfig(id as ModuleId, config, ctx),
    }),
    {} as GuildModulesWithExtraData,
  )

  const channels = guildAPI.channels.cache
    .filter((c): c is NonThreadGuildBasedChannel => !c.isThread())
    .map((channel) => transformBotChannel(channel))

  const roles = guildAPI.roles.cache.map((role) => transformBotRole(role))

  return {
    id: guildAPI.id,
    name: guildAPI.name,
    nameAcronym: guildAPI.nameAcronym,
    iconURL: guildAPI.iconURL(),
    memberCount: guildAPI.memberCount,
    presenceCount: guildAPI.approximatePresenceCount,
    admins,
    modules,
    channels,
    roles,
  }
}

export async function fetchAdmins(
  ctx: ContextWithGuildAuth,
): Promise<TRPCGuildMember[]> {
  const { guildDoc, guildAPI } = ctx.auth

  const adminIds = guildDoc.admins
  const adminMemberPromises = adminIds.map((id) => guildAPI.members.fetch(id))
  const adminMembers = await Promise.all(adminMemberPromises)

  return adminMembers.map((member) => transformBotMember(member, ctx))
}
