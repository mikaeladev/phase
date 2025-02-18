export interface EmojiMartData {
  categories: EmojiMartCategory[]
  emojis: Record<string, EmojiMartEmoji>
  aliases: Record<string, EmojiMartEmoji>
  sheet: EmojiMartSheet
}

export interface EmojiMartCategory {
  id: string
  emojis: string[]
}

export interface EmojiMartEmoji {
  id: string
  name: string
  keywords: string[]
  skins: EmojiMartSkin[]
  version: number
  emoticons?: string[]
}

export interface EmojiMartSkin {
  unified: string
  native: string
  x?: number
  y?: number
}

export interface EmojiMartSheet {
  cols: number
  rows: number
}

export interface Emoji {
  id: string
  name: string
  skin: EmojiMartSkin
}
