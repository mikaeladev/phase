import * as React from "react"

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
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@repo/ui/credenza"
import { Icon } from "@repo/ui/icon"
import { PlusIcon } from "@repo/ui/lucide-icon"
import { ModuleTags } from "~/components/modules/module-tags"

import type { ModuleId } from "@repo/utils/modules"
import type { ModuleDefinitionWithConfig } from "~/types/dashboard"

export interface AddModuleProps {
  moduleDataArray: ModuleDefinitionWithConfig[]
  onSelect?: (moduleId: ModuleId) => void
}

export function AddModule({ moduleDataArray, onSelect }: AddModuleProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaTrigger asChild>
        <Button
          type="button"
          className="gap-2"
          disabled={moduleDataArray.length === 0}
          onClick={() => setIsOpen(true)}
        >
          <span className="hidden sm:inline">Add Module</span>
          <span className="inline sm:hidden">Add</span>
          <Icon icon={<PlusIcon />} />
        </Button>
      </CredenzaTrigger>
      <CredenzaContent
        className="flex max-h-[90%] flex-col gap-8 overflow-auto lg:max-h-[80%]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <CredenzaHeader className="p-0">
          <CredenzaTitle>Add Module</CredenzaTitle>
          <CredenzaDescription>
            Add a new module to your server.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody className="flex flex-col gap-4">
          {moduleDataArray
            .filter((moduleData) => !moduleData.config)
            .map((moduleData) => (
              <Card key={moduleData.id} className="relative">
                <CardHeader className="gap-1.5 space-y-0">
                  <CardTitle>{moduleData.name}</CardTitle>
                  <ModuleTags tags={moduleData.tags} />
                  <Button
                    aria-label={`Add ${moduleData.name}`}
                    variant={"outline"}
                    size={"icon"}
                    className="absolute top-6 right-6 bg-transparent"
                    onClick={() => {
                      setIsOpen(false)
                      onSelect?.(moduleData.id)
                    }}
                  >
                    <Icon icon={<PlusIcon />} />
                  </Button>
                </CardHeader>
                <CardContent>
                  <CardDescription>{moduleData.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  )
}
