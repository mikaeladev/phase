import { Button } from "@repo/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card"
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@repo/ui/credenza"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu"
import { Icon } from "@repo/ui/icon"
import {
  EllipsisVerticalIcon,
  EraserIcon,
  RotateCcwIcon,
  Trash2Icon,
} from "@repo/ui/lucide-icon"
import { BetaAlert } from "~/components/modules/beta-alert"
import { ModuleTags } from "~/components/modules/module-tags"

import { cva } from "~/lib/utils"

import type { ModuleDefinition, ModuleTag } from "@repo/utils/modules"
import type { ModuleDefinitionWithConfig } from "~/types/dashboard"

export type ConfigCardData = ModuleDefinition
export type ConfigCardOption = (typeof moduleOptions)[number]["value"]

export enum ConfigCardStatus {
  Clean = "clean",
  Dirty = "dirty",
  Invalid = "invalid",
  Disabled = "disabled",
}

// module card //

const moduleCardVariants = cva("relative h-full transition-colors", {
  variants: {
    variant: {
      clean: `border-border hover:border-muted-foreground`,
      dirty: `border-muted-foreground bg-muted-foreground/5 hover:border-primary border-dashed`,
      invalid: `border-destructive bg-destructive/5 hover:border-primary border-dashed`,
      disabled: `border-border cursor-not-allowed opacity-50`,
    } satisfies Record<ConfigCardStatus, string>,
  },
})

export interface ConfigCardProps {
  children: React.ReactNode
  moduleData: ModuleDefinitionWithConfig
  moduleStatus: ConfigCardStatus
  onTagSelect: (tag: ModuleTag) => void
  onDropdownSelect: (option: ConfigCardOption) => void
}

export function ConfigCard({
  children,
  moduleData,
  moduleStatus,
  onTagSelect,
  onDropdownSelect,
}: ConfigCardProps) {
  return (
    <Credenza>
      <Card className={moduleCardVariants({ variant: moduleStatus })}>
        <CredenzaTrigger className="focus-visible:ring-ring absolute top-0 left-0 h-full w-full focus-visible:ring-1 focus-visible:outline-hidden" />
        <CardHeader className="gap-1.5 space-y-0">
          <CardTitle>{moduleData.name}</CardTitle>
          <ModuleTags tags={moduleData.tags} onSelect={onTagSelect} />
          <ConfigCardOptions
            moduleStatus={moduleStatus}
            onSelect={onDropdownSelect}
          />
        </CardHeader>
        <CardContent>
          <CardDescription>{moduleData.description}</CardDescription>
        </CardContent>
      </Card>
      <CredenzaContent className="flex max-h-[90%] flex-col gap-6 overflow-auto lg:max-h-[80%]">
        <CredenzaHeader className="pb-0">
          <CredenzaTitle>{moduleData.name}</CredenzaTitle>
          <CredenzaDescription>{moduleData.description}</CredenzaDescription>
        </CredenzaHeader>
        {moduleData.tags.includes("Beta") && <BetaAlert />}
        {children}
      </CredenzaContent>
    </Credenza>
  )
}

// module options //

const moduleOptions = [
  {
    label: "Undo Changes",
    value: "undo",
    icon: <RotateCcwIcon />,
    requiresDirty: true,
  },
  {
    label: "Clear Values",
    value: "reset",
    icon: <EraserIcon />,
  },
  {
    label: "Remove Module",
    value: "remove",
    icon: <Trash2Icon />,
  },
] satisfies {
  label: string
  value: string
  icon?: React.JSX.Element
  requiresDirty?: boolean
}[]

interface ConfigCardOptionsProps {
  moduleStatus: ConfigCardStatus
  onSelect: (item: ConfigCardOption) => void
}

function ConfigCardOptions({ moduleStatus, onSelect }: ConfigCardOptionsProps) {
  const isDirty = moduleStatus === ConfigCardStatus.Dirty

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"outline"}
          size={"icon"}
          className="absolute top-6 right-6 bg-transparent"
        >
          <Icon icon={<EllipsisVerticalIcon />} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {moduleOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            className="gap-2"
            disabled={option.requiresDirty && !isDirty}
            onSelect={() => onSelect(option.value)}
          >
            <Icon icon={option.icon} />
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
