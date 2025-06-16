import { z } from "@repo/zod"

export function moduleSchema<T extends z.ZodRawShape>(schema: T) {
  return z.object({ enabled: z.boolean(), ...schema })
}

export function moduleSchemaExport<TBase extends z.AnyZodObject>(
  schema: TBase,
): ModuleSchemaExport<TBase, TBase>

export function moduleSchemaExport<
  TBase extends z.AnyZodObject,
  TTransformed extends z.AnyZodObject,
>(
  baseSchema: TBase,
  transformedSchema: TTransformed,
  transform: (data: z.TypeOf<TBase>) => z.TypeOf<TTransformed>,
): ModuleSchemaExport<TBase, TTransformed>

export function moduleSchemaExport(
  baseSchema: z.AnyZodObject,
  transformedSchema?: z.AnyZodObject,
  transform?: (data: z.TypeOf<z.AnyZodObject>) => z.TypeOf<z.AnyZodObject>,
): ModuleSchemaExport<z.AnyZodObject, z.AnyZodObject> {
  return {
    baseSchema: baseSchema,
    transformedSchema: transformedSchema ?? baseSchema,
    transform: transform ?? ((data) => data),
  }
}

export interface ModuleSchemaExport<
  TBase extends z.AnyZodObject,
  TTransformed extends z.AnyZodObject,
> {
  baseSchema: TBase
  transformedSchema: TTransformed
  transform: (data: z.TypeOf<TBase>) => z.TypeOf<TTransformed>
}
