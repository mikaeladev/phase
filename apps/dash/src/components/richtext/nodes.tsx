"use client"

import { ChannelIcon } from "~/components/channel-icons"

import { cn } from "~/lib/utils"

import type {
  RenderElementProps,
  RenderLeafProps,
  RenderPlaceholderProps,
} from "slate-react"

export function ElementNode({
  element,
  attributes,
  children,
}: RenderElementProps) {
  switch (element.type) {
    case "channel": {
      return (
        <span {...attributes} className="h-4 cursor-default">
          <span className="text-foreground bg-foreground/25 rounded-[4px] px-1 whitespace-nowrap">
            <span className="mr-0.5 inline-block h-4 align-middle">
              <ChannelIcon
                channelType={element.data.type}
                className="my-auto size-3.5"
              />
            </span>
            <span className="leading-none">{element.data.name}</span>
          </span>
          {children}
        </span>
      )
    }
    case "mention": {
      return (
        <span {...attributes} className="h-4 cursor-default">
          <span
            className="rounded-[4px] px-1 whitespace-nowrap"
            style={{
              color: element.data.colour,
              backgroundColor: element.data.colour + "40",
            }}
          >
            <span className="leading-none">{"@" + element.data.name}</span>
          </span>
          {children}
        </span>
      )
    }
    default: {
      return <span {...attributes}>{children}</span>
    }
  }
}

export function LeafNode({ attributes, children, leaf }: RenderLeafProps) {
  return (
    <span
      {...attributes}
      spellCheck={!leaf.codeblock && !leaf.code}
      className={cn(
        leaf.h1 && "text-lg font-bold",
        leaf.h2 && "text-base font-bold",
        leaf.h3 && "text-sm font-bold",
        leaf.subtext && "text-muted-foreground text-xs font-medium",
        leaf.bold && "font-bold",
        leaf.italic && "italic",
        leaf.strike && "line-through",
        leaf.underline && "underline underline-offset-2",
        leaf.spoiler && "bg-muted text-muted-foreground rounded-[4px] px-1",
        leaf.code && "text-muted-foreground font-mono text-xs leading-5",
        leaf.codeblock && "text-muted-foreground font-mono text-xs leading-5",
        leaf.punctuation && "text-muted-foreground bg-transparent px-px",
        leaf.punctuation && leaf.strike && "no-underline",
        leaf.punctuation && leaf.underline && "no-underline",
        leaf.punctuation && leaf.code && "font-sans text-sm",
        leaf.punctuation && leaf.codeblock && "font-sans text-sm",
      )}
    >
      {children}
    </span>
  )
}

export function PlaceholderNode({ children }: RenderPlaceholderProps) {
  return (
    <>
      <span
        data-slate-placeholder={true}
        contentEditable={false}
        suppressContentEditableWarning={true}
        className="text-muted-foreground pointer-events-none absolute text-sm select-none"
      >
        {children}
      </span>
      {navigator.userAgent.includes("Android") && <br />}
    </>
  )
}
