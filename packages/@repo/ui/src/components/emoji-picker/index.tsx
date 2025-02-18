"use client"

import * as React from "react"

import { Collection } from "@discordjs/collection"
import { cn } from "@repo/utils/site"
import { useDebounce } from "@uidotdev/usehooks"
import { init as emojiMartInit, SearchIndex } from "emoji-mart"

import { Button } from "~/components/button"
import { Input } from "~/components/input"
import { Label } from "~/components/label"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/popover"
import { ScrollArea } from "~/components/scroll-area"
import { Spinner } from "~/components/spinner"

import type {
  Emoji,
  EmojiMartData,
  EmojiMartEmoji,
  EmojiMartSheet,
} from "./emoji-types"

const emojiDataPromise = fetch(
  "https://cdn.jsdelivr.net/npm/@emoji-mart/data@1.2.1/sets/15/twitter.json",
).then((res) => res.json() as Promise<EmojiMartData>)

// emoji picker component //

interface EmojiPickerComponentProps {
  size?: "default" | "fill"
  disabled?: boolean
  name?: string
  value?: string
  ref?: React.Ref<HTMLButtonElement>
  onBlur?: React.FocusEventHandler<HTMLButtonElement>
  onChange?: (value: string) => void
}

function EmojiPickerComponent({
  onChange,
  value,
  size,
  ...props
}: EmojiPickerComponentProps) {
  const [open, setOpen] = React.useState(false)

  const [searchTerm, setSearchTerm] = React.useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const [searchResults, setSearchResults] = React.useState<Emoji[]>([])

  // load emoji data
  const emojiData = React.use(emojiDataPromise)

  // initialise emoji mart
  React.use(emojiMartInit({ data: emojiData }))

  // a collection of emojis
  const emojis = React.useMemo(() => {
    const emojis = new Collection<string, Emoji>()

    for (const emoji of Object.values(emojiData.emojis)) {
      emojis.set(emoji.id, {
        id: emoji.id,
        name: emoji.name,
        skin: emoji.skins[0]!,
      })
    }

    return emojis
  }, [emojiData])

  // the emoji to show when nothing is selected
  const fallbackEmoji = emojis.get("crescent_moon")!

  // the emoji to show when a value is selected
  const [selectedEmoji, setSelectedEmoji] = React.useState<Emoji>(
    value
      ? (emojis.find((emoji) => emoji.skin.native === value) ?? fallbackEmoji)
      : fallbackEmoji,
  )

  // handles searching for emojis
  const searchEmojis = React.useCallback(async (query: string) => {
    const queryResults = query.length
      ? ((await SearchIndex.search(query)) as EmojiMartEmoji[])
      : []

    const newSearchResults = queryResults.map((emoji) => {
      const { id, name, skins } = emoji
      return { id, name, skin: skins[0]! }
    })

    setSearchResults(newSearchResults)
  }, [])

  // calls `searchEmojis` when the search term changes
  React.useEffect(() => {
    void searchEmojis(debouncedSearchTerm)
  }, [searchEmojis, debouncedSearchTerm])

  // handles clicking on an emoji
  const onClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const dataset = event.currentTarget.dataset

      const emoji: Emoji = {
        id: dataset.emojiId!,
        name: dataset.emojiName!,
        skin: {
          unified: dataset.emojiSkinUnified!,
          native: dataset.emojiSkinNative!,
          x: +dataset.emojiSkinX!,
          y: +dataset.emojiSkinY!,
        },
      }

      onChange?.(emoji.skin.native)
      setSelectedEmoji(emoji)
      setOpen(false)
    },
    [onChange],
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size={size === "fill" ? "default" : "icon"}
          className={cn(
            size === "fill" ? "w-full justify-start gap-2.5" : "justify-center",
          )}
          {...props}
        >
          <EmojiPickerEmoji
            emoji={selectedEmoji}
            sheet={emojiData.sheet}
            isPlaceholder={onChange && !value}
            className="size-5"
          />
          {size === "fill" &&
            (onChange && !value ? (
              <span>Pick an emoji</span>
            ) : (
              <span>:{selectedEmoji.id}:</span>
            ))}
        </Button>
      </PopoverTrigger>
      <PopoverContent sideOffset={8} className="size-80 space-y-4">
        <Input
          placeholder="Search emojis..."
          onChange={(value) => setSearchTerm(value ?? "")}
        />
        <div className="h-[calc(100%-52px)]">
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-4">
              {emojiData.categories.map((category) => {
                const categoryEmojis = emojis.filter((emoji) =>
                  category.emojis.includes(emoji.id),
                )

                const visibleCategoryEmojis = debouncedSearchTerm.length
                  ? categoryEmojis.filter((categoryEmoji) =>
                      searchResults.find(
                        (searchResultEmoji) =>
                          searchResultEmoji.id === categoryEmoji.id,
                      ),
                    )
                  : categoryEmojis

                return (
                  <div
                    key={category.id}
                    aria-hidden={!visibleCategoryEmojis.size}
                    className="space-y-2 aria-hidden:hidden"
                  >
                    <Label className="capitalize">{category.id}</Label>
                    <div className="grid grid-cols-9 text-xl">
                      {categoryEmojis.map((emoji) => {
                        const isHidden = !visibleCategoryEmojis.has(emoji.id)
                        return (
                          <EmojiPickerEmoji
                            key={emoji.id}
                            emoji={emoji}
                            sheet={emojiData.sheet}
                            aria-hidden={isHidden}
                            onClick={onClick}
                            role="button"
                          />
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// emoji picker fallback //

interface EmojiPickerFallbackProps extends EmojiPickerComponentProps {}

function EmojiPickerFallback({ size }: EmojiPickerFallbackProps) {
  return (
    <Button
      variant="outline"
      size={size === "fill" ? "default" : "icon"}
      className={cn(size === "fill" && "w-full justify-start gap-2")}
      disabled
    >
      <Spinner className="size-4" />
      {size === "fill" && <span>Loading ...</span>}
    </Button>
  )
}

// emoji picker emoji //

interface EmojiPickerEmojiProps extends React.HTMLAttributes<HTMLDivElement> {
  emoji: Emoji
  sheet: EmojiMartSheet
  isPlaceholder?: boolean
}

function EmojiPickerEmoji({
  emoji,
  sheet,
  className,
  isPlaceholder,
  ...props
}: EmojiPickerEmojiProps) {
  return (
    <div
      title={emoji.name}
      aria-label={emoji.name}
      data-emoji-id={emoji.id}
      data-emoji-name={emoji.name}
      data-emoji-skin-unified={emoji.skin.unified}
      data-emoji-skin-native={emoji.skin.native}
      data-emoji-skin-x={emoji.skin.x}
      data-emoji-skin-y={emoji.skin.y}
      className={cn(
        "hover:bg-accent grid aspect-square place-items-center rounded-sm aria-hidden:hidden",
        className,
      )}
      {...props}
    >
      <span
        className={cn("block size-3/4", isPlaceholder && "opacity-50")}
        style={{
          backgroundImage: `url("https://cdn.jsdelivr.net/npm/emoji-datasource-twitter@15.0.0/img/twitter/sheets-256/64.png")`,
          backgroundSize: `${100 * sheet.cols}% ${100 * sheet.rows}%`,
          backgroundPosition: `${(100 / (sheet.cols - 1)) * emoji.skin.x!}% ${(100 / (sheet.rows - 1)) * emoji.skin.y!}%`,
        }}
      />
    </div>
  )
}

// emoji picker //

export interface EmojiPickerProps extends EmojiPickerComponentProps {}

export function EmojiPicker(props: EmojiPickerProps) {
  return (
    <React.Suspense fallback={<EmojiPickerFallback size={props.size} />}>
      <EmojiPickerComponent {...props} />
    </React.Suspense>
  )
}
