type DataType =
  | string
  | number
  | boolean
  | null
  | undefined
  | DataType[]
  | { [key: string]: DataType }

export interface Form {
  name: string
  description: string
  body: Record<string, FormElement>
}

export type FormElement =
  | FormElementInput
  | FormElementTextarea
  | FormElementDropdown
  | FormElementArray

type FormElementAttributes<T extends Record<string, DataType> = {}> = {
  label: string
  description: string
} & T

type FormElementValidations<T extends Record<string, DataType> = {}> = {
  required?: boolean
} & T

interface _FormElementBase {
  id: string
  type: string
  attributes: FormElementAttributes
  validations?: FormElementValidations
}

export interface FormElementInput extends _FormElementBase {
  type: "input"
  attributes: FormElementAttributes<{
    placeholder?: string
    disabled?: boolean
    defaultValue?: string
  }>
  validations?: FormElementValidations<
    | {
        type?: "string"
        pattern?: string
        minLength?: number
        maxLength?: number
      }
    | {
        type: "integer"
        min?: number
        max?: number
      }
  >
}

export interface FormElementTextarea extends _FormElementBase {
  type: "textarea"
  attributes: FormElementAttributes<{
    placeholder?: string
    disabled?: boolean
    defaultValue?: string
  }>
  validations?: FormElementValidations<{
    minLength?: number
    maxLength?: number
  }>
}

export interface FormElementDropdown extends _FormElementBase {
  type: "dropdown"
  attributes: FormElementAttributes<
    {
      placeholder?: string
      disabled?: boolean
    } & (
      | { multiple?: false; defaultValue?: string }
      | { multiple?: true; defaultValue?: string[] }
    ) &
      (
        | { type: "string"; options: { label: string; value: string }[] }
        | { type?: "channel" | "role" | "mentionable" }
      )
  >
  validations?: FormElementValidations<{
    min?: number
    max?: number
  }>
}

export interface FormElementArray {
  type: "array"
  attributes: FormElementAttributes<{
    disabled?: boolean
  }> & {
    body: Record<string, FormElement>
  }
  validations?: FormElementValidations<{
    min?: number
    max?: number
  }>
}
