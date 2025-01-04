import { ChannelType } from "discord-api-types/v10"

import { Icon } from "@repo/ui/icon"
import {
  FolderIcon,
  HashIcon,
  ImageIcon,
  MessagesSquareIcon,
  NewspaperIcon,
  Volume2Icon,
} from "@repo/ui/lucide-icon"

import type { IconProps } from "@repo/ui/icon"
import type { APIChannel } from "discord-api-types/v10"

export const AllowedChannelTypes = {
  GuildAnnouncement: ChannelType.GuildAnnouncement,
  GuildCategory: ChannelType.GuildCategory,
  GuildForum: ChannelType.GuildForum,
  GuildMedia: ChannelType.GuildMedia,
  GuildStageVoice: ChannelType.GuildStageVoice,
  GuildText: ChannelType.GuildText,
  GuildVoice: ChannelType.GuildVoice,
} as const

export type AllowedChannelType =
  (typeof AllowedChannelTypes)[keyof typeof AllowedChannelTypes]

export type AllowedAPIChannel = APIChannel & { type: AllowedChannelType }

export const channelIcons: Record<AllowedChannelType, React.FC> = {
  [ChannelType.GuildAnnouncement]: NewspaperIcon,
  [ChannelType.GuildCategory]: FolderIcon,
  [ChannelType.GuildForum]: MessagesSquareIcon,
  [ChannelType.GuildMedia]: ImageIcon,
  [ChannelType.GuildStageVoice]: Volume2Icon,
  [ChannelType.GuildText]: HashIcon,
  [ChannelType.GuildVoice]: Volume2Icon,
}

export interface ChannelIconProps extends Omit<IconProps, "icon"> {
  channelType: AllowedChannelType
}

export function ChannelIcon({ channelType, ...props }: ChannelIconProps) {
  const ChannelIcon = channelIcons[channelType]
  return <Icon icon={ChannelIcon} {...props} />
}
