"use client"

import * as React from "react"

import { cn, cva } from "@repo/utils/site"
import { Command as CommandPrimitive } from "cmdk"
import { createEditor, Editor, Element, Node, Text, Transforms } from "slate"
import { withHistory } from "slate-history"
import { Editable, Slate, withReact } from "slate-react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@repo/ui/command"
import { Icon } from "@repo/ui/icon"
import { AtSignIcon } from "@repo/ui/lucide-icon"
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover"
import { ChannelIcon } from "~/components/channel-icons"

import { useElementSize } from "~/hooks/use-element-size"

import { preventDefault } from "~/lib/utils"

import { getCurrentWord } from "./current-word"
import { decorateEntry } from "./decorators"
import { useGuildData } from "./hooks"
import { ElementNode, LeafNode, PlaceholderNode } from "./nodes"
import { createInlineElementSplitter } from "./splitters"
import { createDfmTransformer } from "./transformers"
import { defaultRichtextFlags, isElement } from "./utils"

import type { InlineElementSplitter } from "./splitters"
import type { VariantProps } from "@repo/utils/site"
import type { TextElement } from "~/types/slate"
import type { BaseEditor, Descendant, NodeEntry, Path } from "slate"
import type { HistoryEditor } from "slate-history"
import type { ReactEditor } from "slate-react"

export const richtextVariants = cva(
  "border-input bg-background focus-visible:ring-ring flex w-full flex-col rounded-md border px-3 py-2 text-sm tracking-tight shadow-xs read-only:cursor-not-allowed read-only:opacity-50 focus-visible:ring-1 focus-visible:outline-hidden",
  {
    variants: {
      variant: {
        input: "h-9 resize-none truncate py-1",
        textarea: "min-h-20",
      },
    },
  },
)

export type RichtextEditor = BaseEditor & ReactEditor & HistoryEditor

export interface RichtextFlags {
  multiline?: boolean
  decorations?: boolean
  mentions?: boolean
  channels?: boolean
  variables?: boolean
}

export interface RichtextProps
  extends Omit<React.TextareaHTMLAttributes<HTMLDivElement>, "onChange">,
    Required<VariantProps<typeof richtextVariants>> {
  ref?: React.Ref<HTMLDivElement>
  value?: string | undefined
  flags?: RichtextFlags
  onChange?: (value: string | undefined) => void
}

export function Richtext({
  className,
  variant,
  value = "",
  flags = defaultRichtextFlags[variant!],
  ref: refProp,
  onChange: onChangeProp,
  onKeyDown: onKeyDownProp,
  onBlur: onBlurProp,
  ...props
}: RichtextProps) {
  // editor instance //

  const editor: RichtextEditor = React.useMemo(() => {
    const editor = withHistory(withReact(createEditor()))

    const { isInline, isVoid } = editor

    editor.isInline = (el) => el.type !== "text" || isInline(el)
    editor.isVoid = (el) => el.type !== "text" || isVoid(el)

    return editor
  }, [])

  // editor render functions //

  const renderElement = React.useCallback(ElementNode, [])
  const renderPlaceholder = React.useCallback(PlaceholderNode, [])
  const renderLeaf = React.useCallback(LeafNode, [])

  // editor decorate function //

  const decorate = React.useCallback(
    (entry: NodeEntry) => {
      if (!flags.decorations) return []
      return decorateEntry(entry)
    },
    [flags.decorations],
  )

  // select menu logic //

  const currentWord = getCurrentWord(editor, flags)

  const [selectOpen, setSelectOpen] = React.useState(false)
  const [selectQuery, setSelectQuery] = React.useState("")

  React.useEffect(() => {
    const isNotText = !!(currentWord && currentWord.type !== "text")
    setSelectOpen(isNotText)
    setSelectQuery(isNotText ? currentWord.word.slice(1) : "")
  }, [currentWord])

  const onSelectItemSelect = React.useCallback(
    (data: Exclude<Element, { type: "text" }>["data"]) => {
      const element: Exclude<Element, { type: "text" }> =
        typeof data.type === "number"
          ? { type: "channel" as const, children: [{ text: "" }], data }
          : { type: "mention" as const, children: [{ text: "" }], data }

      const nodeAfter = Editor.after(editor, currentWord!.range)

      Transforms.insertNodes(editor, element, {
        at: {
          ...currentWord!.range,
          offset: currentWord!.word.length,
        },
      })

      if (!nodeAfter) {
        Transforms.move(editor, { distance: 2, unit: "offset" })
      }
    },
    [editor, currentWord],
  )

  // data transformers //

  const guildData = useGuildData(flags)

  const inlineElementSplitter: InlineElementSplitter = React.useCallback(
    (...args) => createInlineElementSplitter(flags, guildData)(...args),
    [flags, guildData],
  )

  const { docToDfm, dfmToDoc } = React.useMemo(
    () => createDfmTransformer(flags, guildData),
    [flags, guildData],
  )

  // value change handler //

  const onSlateValueChange = React.useCallback(
    (elements: Descendant[]) => {
      const textElements = elements.filter(
        (el): el is TextElement => isElement(el) && el.type === "text",
      )

      if (textElements.length !== elements.length) {
        throw new Error("Descendant is not a text element")
      }

      const traverse = (path: Path) => {
        const node = Node.get(editor, path)

        if (!Text.isText(node)) {
          Node.children(editor, path).forEach(([, p]) => traverse(p))
          return
        }

        const splitInlineElements = inlineElementSplitter(path, node)

        for (const { element, range, offset } of splitInlineElements) {
          const deleteOptions = { at: { ...range } }
          const insertOptions = { at: { path, offset } }

          Transforms.delete(editor, deleteOptions)
          Transforms.insertNodes(editor, element, insertOptions)

          const nodeAfter = Editor.after(editor, range)
          if (nodeAfter) return

          Transforms.move(editor, { distance: 2, unit: "offset" })
        }
      }

      traverse([])

      if (onChangeProp) {
        const value = docToDfm(textElements)
        console.log(value, textElements)
        onChangeProp(value.length ? value : undefined)
      }
    },
    [editor, inlineElementSplitter, docToDfm, onChangeProp],
  )

  // key down handler //

  const onEditorKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (onKeyDownProp) onKeyDownProp(event)

      if (!selectOpen) {
        event.stopPropagation()

        if (event.key === "Enter") {
          preventDefault(event)
          if (flags.multiline) editor.insertBreak()
        }
      }

      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        const { selection } = editor

        if (selection) {
          const direction = event.key === "ArrowRight" ? 1 : -1

          const targetPoint = Editor[direction === -1 ? "before" : "after"](
            editor,
            selection,
            {
              distance: 1,
              unit: "character",
            },
          )

          const [targetNode] = targetPoint
            ? Editor.parent(editor, targetPoint)
            : [undefined, undefined]

          if (
            Element.isElement(targetNode) &&
            Editor.isInline(editor, targetNode)
          ) {
            preventDefault(event)

            Transforms.move(editor, {
              distance: 2,
              unit: "offset",
              reverse: direction === -1,
            })
          }
        }
      }

      if (event.ctrlKey) {
        if (event.key === "z") {
          event.stopPropagation()
          event.preventDefault()
          editor.undo()
        }

        if (event.key === "y") {
          event.stopPropagation()
          event.preventDefault()
          editor.redo()
        }
      }
    },
    [editor, selectOpen, flags.multiline, onKeyDownProp],
  )

  // blur handler //

  const onEditorBlur = React.useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      if (onBlurProp) onBlurProp(event)
      setSelectOpen(false)
    },
    [onBlurProp],
  )

  // render component //

  const editorRef = React.useRef<HTMLDivElement>(null)
  const editorWidth = useElementSize(editorRef)[0]

  React.useImperativeHandle(refProp, () => editorRef.current!)

  return (
    <Command loop>
      <Popover open={selectOpen}>
        <Slate
          editor={editor}
          initialValue={dfmToDoc(value ?? "")}
          onValueChange={onSlateValueChange}
        >
          <PopoverTrigger onClick={preventDefault} asChild>
            <Editable
              ref={editorRef}
              decorate={decorate}
              renderElement={renderElement}
              renderPlaceholder={renderPlaceholder}
              renderLeaf={renderLeaf}
              onKeyDown={onEditorKeyDown}
              onBlur={onEditorBlur}
              className={cn(richtextVariants({ variant }), className)}
              readOnly={props.disabled}
              {...props}
            />
          </PopoverTrigger>
        </Slate>
        <PopoverContent
          style={{ width: `${editorWidth}px` }}
          side="top"
          className="p-0"
          sideOffset={8}
          onOpenAutoFocus={preventDefault}
          onCloseAutoFocus={preventDefault}
        >
          {currentWord && currentWord.type !== "text" && (
            <>
              <CommandPrimitive.Input value={selectQuery} className="hidden" />
              <CommandList className="max-h-[168px]">
                <CommandEmpty>{"No results found :("}</CommandEmpty>
                <CommandGroup>
                  {guildData[`${currentWord.type}s` as const].map((data) => {
                    const isChannel = typeof data.type === "number"
                    const isMention = typeof data.type === "string"
                    const hasIcon = isChannel || isMention
                    const hasColour = "colour" in data

                    return (
                      <CommandItem
                        className="gap-1"
                        key={data.id}
                        value={data.id}
                        keywords={[data.name]}
                        style={{ color: hasColour ? data.colour : undefined }}
                        onSelect={() => onSelectItemSelect(data)}
                      >
                        {hasIcon && (
                          <Icon
                            className="size-3.5"
                            icon={
                              isChannel ? (
                                <ChannelIcon channelType={data.type} />
                              ) : (
                                <AtSignIcon />
                              )
                            }
                          />
                        )}
                        <span>{data.name}</span>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </CommandList>
            </>
          )}
        </PopoverContent>
      </Popover>
    </Command>
  )
}
