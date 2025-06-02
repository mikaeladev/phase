// THIS IS VERY UGLY AND STILL A WORK IN PROGRESS //

import { z } from "@repo/zod"

import type {
  Form,
  FormElement,
  FormElementArray,
  FormElementDropdown,
  FormElementInput,
  FormElementTextarea,
} from "~/types"

export type FormSchema<T extends Form> = z.ZodObject<{
  [key in keyof T["body"]]: FormElementSchema<T["body"][key]>
}>

export function createFormSchema<T extends Form>(form: T): FormSchema<T> {
  return z.object(
    Object.entries(form.body).reduce((acc, [key, value]) => {
      acc[key] = createFormElementSchema(value)
      return acc
    }, {} as z.ZodRawShape),
  ) as FormSchema<T>
}

type FormElementInputSchema<
  T extends FormElementInput | undefined = undefined,
> = T extends FormElementInput
  ? T["validations"] extends { type: "integer" }
    ? z.ZodNumber | z.ZodOptional<z.ZodNumber>
    : z.ZodString | z.ZodOptional<z.ZodString>
  : never

export type FormElementSchema<T extends FormElement> =
  T extends FormElementInput
    ? FormElementInputSchema<T>
    : T extends FormElementTextarea
      ? z.ZodString | z.ZodOptional<z.ZodString>
      : T extends FormElementDropdown
        ? T["attributes"]["multiple"] extends true
          ?
              | z.ZodArray<z.ZodString, "atleastone" | "many">
              | z.ZodOptional<z.ZodArray<z.ZodString, "many">>
          : z.ZodString | z.ZodOptional<z.ZodString>
        : T extends FormElementArray
          ?
              | z.ZodArray<z.ZodObject<z.ZodRawShape>, "atleastone" | "many">
              | z.ZodOptional<z.ZodArray<z.ZodObject<z.ZodRawShape>, "many">>
          : never

export function createFormElementSchema<T extends FormElement>(
  element: T,
): FormElementSchema<T> {
  // input element //

  if (isElementType(element, "input")) {
    if (element.validations?.type === "integer") {
      let schema: FormElementInputSchema<
        FormElementInput & { validations: { type: "integer" } }
      > = z.coerce.number()

      if (element.validations.min) {
        schema = schema.min(element.validations.min)
      }

      if (element.validations.max) {
        schema = schema.max(element.validations.max)
      }

      if (!element.validations.required) {
        schema = schema.optional()
      }

      return schema as FormElementSchema<T>
    }

    let schema: FormElementInputSchema<
      FormElementInput & { validations: { type: "string" } }
    > = z.string()

    if (element.validations?.required) {
      schema = schema.nonempty()
    }

    if (element.validations?.pattern) {
      schema = schema.regex(RegExp(element.validations.pattern))
    }

    if (element.validations?.minLength) {
      schema = schema.min(element.validations.minLength)
    }

    if (element.validations?.maxLength) {
      schema = schema.max(element.validations.maxLength)
    }

    if (element.validations?.required) {
      schema = schema.nonempty()
    } else {
      schema = schema.optional()
    }

    return schema as FormElementSchema<T>
  }

  // textarea element //

  if (element.type === "textarea") {
    let schema: z.ZodString | z.ZodOptional<z.ZodString> = z.string()

    if (element.validations?.minLength) {
      schema = schema.min(element.validations.minLength)
    }

    if (element.validations?.maxLength) {
      schema = schema.max(element.validations.maxLength)
    }

    if (element.validations?.required) {
      schema = schema.nonempty()
    } else {
      schema = schema.optional()
    }

    return schema as FormElementSchema<T>
  }

  // dropdown element //

  if (element.type === "dropdown") {
    if (element.attributes.multiple) {
      let schema:
        | z.ZodArray<z.ZodString, "atleastone" | "many">
        | z.ZodOptional<z.ZodArray<z.ZodString, "many">> = z.string().array()

      if (element.validations?.min) {
        schema = schema.min(element.validations.min)
      }

      if (element.validations?.max) {
        schema = schema.max(element.validations.max)
      }

      if (element.validations?.required) {
        schema = schema.nonempty()
      } else {
        schema = schema.optional()
      }

      return schema as FormElementSchema<T>
    }

    let schema: z.ZodString | z.ZodOptional<z.ZodString> = z.string()

    if (element.validations?.required) {
      schema = schema.nonempty()
    } else {
      schema = schema.optional()
    }

    return schema as FormElementSchema<T>
  }

  // array element //

  if (element.type === "array") {
    let schema:
      | z.ZodArray<z.ZodObject<z.ZodRawShape>, "atleastone" | "many">
      | z.ZodOptional<z.ZodArray<z.ZodObject<z.ZodRawShape>, "many">> = z
      .object(
        Object.entries(element.attributes.body).reduce((acc, [key, value]) => {
          acc[key] = createFormElementSchema(value)
          return acc
        }, {} as z.ZodRawShape),
      )
      .array()

    if (element.validations?.min) {
      schema = schema.min(element.validations.min)
    }

    if (element.validations?.max) {
      schema = schema.max(element.validations.max)
    }

    if (element.validations?.required) {
      schema = schema.nonempty()
    } else {
      schema = schema.optional()
    }

    return schema as FormElementSchema<T>
  }

  // unknown element //

  throw new Error(`Unknown form element type: ${(element as FormElement).type}`)
}

function isElementType<
  TElement extends FormElement,
  TType extends FormElement["type"] = TElement["type"],
>(element: TElement, type: TType): element is TElement & { type: TType } {
  return element.type === type
}
