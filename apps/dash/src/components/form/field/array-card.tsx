import { Button } from "@repo/ui/button"
import { ButtonGroup } from "@repo/ui/button-group"
import { Card, CardContent, CardTitle } from "@repo/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@repo/ui/form"
import { Icon } from "@repo/ui/icon"
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CopyIcon,
  MoveIcon,
  TrashIcon,
} from "@repo/ui/lucide-icon"
import { useFormFieldArrayContext } from "~/components/form/field/array"

import type { Control, FieldPath, FieldValues } from "react-hook-form"

export interface FormFieldArrayCardProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>
  name: TName
  index: number
  label: string
  description?: string
  children: React.ReactNode
}

export function FormFieldArrayCard<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: FormFieldArrayCardProps<TFieldValues, TName>) {
  const { fields, append, remove, move } = useFormFieldArrayContext()

  return (
    <FormField
      control={props.control}
      name={props.name}
      render={({ field }) => (
        <FormItem className="space-y-0">
          <Card>
            <div className="flex items-center justify-between gap-2 px-6 py-3">
              <div className="flex min-w-0 flex-col gap-1.5">
                <FormLabel asChild>
                  <CardTitle className="truncate">{props.label}</CardTitle>
                </FormLabel>
                <FormDescription className="sr-only">
                  {props.description ?? props.label}
                </FormDescription>
              </div>
              <ButtonGroup>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size={"icon"} variant={"outline"} aria-label="Move">
                      <Icon icon={<MoveIcon />} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      disabled={props.index === 0}
                      onClick={() => move(props.index, props.index - 1)}
                    >
                      <Icon icon={<ChevronUpIcon />} />
                      Move up
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={props.index === fields.length - 1}
                      onClick={() => move(props.index, props.index + 1)}
                    >
                      <Icon icon={<ChevronDownIcon />} />
                      Move down
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  size={"icon"}
                  variant={"outline"}
                  aria-label="Duplicate"
                  onClick={() => append(field.value, { shouldFocus: true })}
                >
                  <Icon icon={<CopyIcon />} />
                </Button>
                <Button
                  size={"icon"}
                  variant={"outline"}
                  aria-label="Delete"
                  onClick={() => remove(props.index)}
                >
                  <Icon icon={<TrashIcon />} />
                </Button>
              </ButtonGroup>
            </div>
            <FormControl>
              <CardContent className="space-y-6 border-t pt-6">
                {props.children}
              </CardContent>
            </FormControl>
          </Card>
        </FormItem>
      )}
    />
  )
}
