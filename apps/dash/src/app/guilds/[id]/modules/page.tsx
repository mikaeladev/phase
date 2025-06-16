"use client"

import * as React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { ModuleDefinitions } from "@repo/utils/modules"
import { useForm } from "react-hook-form"

import { Form } from "@repo/ui/form"
import { ActionBar } from "~/components/modules/action-bar"
import { AddModule } from "~/components/modules/add-module"
import { ConfigCard, ConfigCardStatus } from "~/components/modules/config-card"
import { SelectFilter } from "~/components/modules/select-filter"

import { useDashboardContext } from "~/hooks/use-dashboard-context"

import { modulesFormSchema } from "~/lib/schemas"

import { updateModules } from "./actions"
import { moduleFormFields } from "./forms"
import {
  emptyFormValues,
  getDirtyKeys,
  getInvalidKeys,
  resolveFormValues,
} from "./utils"

import type { ModuleId, ModuleTag } from "@repo/utils/modules"
import type { ConfigCardOption } from "~/components/modules/config-card"
import type { FilterOption } from "~/components/modules/select-filter"
import type {
  ModuleDefinitionWithConfig,
  ModulesFormSchemaType,
} from "~/types/dashboard"
import type { SubmitHandler } from "react-hook-form"

export default function ModulesPage() {
  const dashboardData = useDashboardContext()
  const guildData = React.use(dashboardData.guild)

  const [filter, setFilter] = React.useState<FilterOption["value"]>("none")

  const defaultFormValues = resolveFormValues(guildData)

  const form = useForm<ModulesFormSchemaType>({
    resolver: zodResolver(modulesFormSchema),
    defaultValues: defaultFormValues,
  })

  const formFields = form.watch()
  const formState = form.formState

  const dirtyKeys = getDirtyKeys(form)
  const invalidKeys = getInvalidKeys(form)

  const moduleDefinitionsWithConfigs = React.useMemo(() => {
    return Object.values(ModuleDefinitions).map((value) => {
      return {
        ...value,
        config: formFields[value.id],
      } as ModuleDefinitionWithConfig
    })
  }, [formFields])

  const filteredModuleDefinitionsWithConfigs = React.useMemo(() => {
    return moduleDefinitionsWithConfigs.filter((module) => {
      if (filter === "none") return true
      return module.tags.some((tag) => tag.toLowerCase() === filter)
    })
  }, [filter, moduleDefinitionsWithConfigs])

  const onModuleAdd = (moduleId: ModuleId) => {
    form.setValue(
      moduleId,
      { ...emptyFormValues[moduleId], enabled: true },
      { shouldDirty: true },
    )
  }

  const onSubmit: SubmitHandler<ModulesFormSchemaType> = async (formValues) => {
    const id = guildData.id

    const updateResult = await updateModules(id, formValues, dirtyKeys)
    const newDefaultValues = resolveFormValues({ id, modules: updateResult })

    form.reset(newDefaultValues)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="[--column-count:1] lg:[--column-count:2] xl:[--column-count:3]"
      >
        <div className="mb-8 grid w-full grid-cols-[repeat(var(--column-count),minmax(0,1fr))] gap-4">
          <h1 className="hidden text-3xl font-bold lg:block xl:col-span-2">
            Modules
          </h1>
          <div className="flex space-x-2">
            <SelectFilter value={filter} onValueChange={setFilter} />
            <AddModule
              moduleDataArray={filteredModuleDefinitionsWithConfigs}
              onSelect={onModuleAdd}
            />
          </div>
        </div>
        <ActionBar dirtyKeys={dirtyKeys} invalidKeys={invalidKeys} />
        <div className="grid grid-cols-[repeat(var(--column-count),minmax(0,1fr))] gap-4">
          {filteredModuleDefinitionsWithConfigs.map((moduleData) => {
            if (!moduleData.config) return null

            const ModuleFormFields = moduleFormFields[moduleData.id]
            if (!ModuleFormFields) return null

            const moduleStatus = formState.isSubmitting
              ? ConfigCardStatus.Disabled
              : invalidKeys.includes(moduleData.id)
                ? ConfigCardStatus.Invalid
                : dirtyKeys.includes(moduleData.id)
                  ? ConfigCardStatus.Dirty
                  : ConfigCardStatus.Clean

            const onTagSelect = (tag: ModuleTag) => {
              const value = tag.toLowerCase() as FilterOption["value"]
              if (value === filter) setFilter("none")
              else setFilter(value)
            }

            const onDropdownSelect = (option: ConfigCardOption) => {
              switch (option) {
                case "undo": {
                  return form.resetField(moduleData.id, {
                    defaultValue: defaultFormValues[moduleData.id],
                  })
                }
                case "reset": {
                  return form.setValue(
                    moduleData.id,
                    { ...emptyFormValues[moduleData.id], enabled: true },
                    { shouldDirty: true },
                  )
                }
                case "remove": {
                  return form.setValue(moduleData.id, undefined, {
                    shouldDirty: true,
                  })
                }
              }
            }

            return (
              <ConfigCard
                key={moduleData.id}
                moduleData={moduleData}
                moduleStatus={moduleStatus}
                onTagSelect={onTagSelect}
                onDropdownSelect={onDropdownSelect}
              >
                <ModuleFormFields />
              </ConfigCard>
            )
          })}
        </div>
      </form>
    </Form>
  )
}
