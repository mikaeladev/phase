import type { GuildModulesWithExtraData } from "~/types/modules"
import type { APIOverwrite } from "discord.js"

export type TRPCGuildChannel = {
  id: string
  name: string
  type: number
  flags: number
  position: number
  parentId: string | null
  permissionOverwrites: APIOverwrite[]
}

export type TRPCGuildRole = {
  id: string
  name: string
  color: number
  position: number
  permissions: string
  flags: number
  isHoisted: boolean
  isManaged: boolean
  isMentionable: boolean
}

export type TRPCGuildMember = {
  id: string
  username: string
  displayName: string
  avatarURL: string
  joinedAt: string
  isAdmin: boolean
  isOwner: boolean
}

export type TRPCGuild = {
  id: string
  name: string
  nameAcronym: string
  iconURL: string | null
  memberCount: number
  presenceCount: number | null
  modules: GuildModulesWithExtraData
  admins: TRPCGuildMember[]
  channels: TRPCGuildChannel[]
  roles: TRPCGuildRole[]
}
