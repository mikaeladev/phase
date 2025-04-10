"use client"

import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "@repo/utils/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@repo/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/form"
import { Input } from "@repo/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/select"
import { Textarea } from "@repo/ui/textarea"
import { Toaster } from "~/components/toaster"

const bugReportFormSchema = z.object({
  subject: z.string().max(100).nonempty(),
  body: z.string().max(2000).nonempty(),
  urgency: z.enum(["low", "medium", "high"]),
  guildId: z.string().snowflake().optional(),
  channelId: z.string().snowflake().optional(),
})

export type BugReportFormValues = z.infer<typeof bugReportFormSchema>

export interface BugReportFormProps {
  defaultValues?: Partial<BugReportFormValues>
  action: (data: BugReportFormValues) => Promise<unknown>
}

export function BugReportForm(props: BugReportFormProps) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle")

  const disabled = status === "loading" || status === "success"

  const form = useForm<BugReportFormValues>({
    resolver: zodResolver(bugReportFormSchema),
    defaultValues: props.defaultValues,
  })

  const onSubmit = (data: BugReportFormValues) => {
    if (disabled) throw new Error("Form is disabled")

    setStatus("loading")

    toast.promise(props.action(data), {
      loading: "Sending bug report...",
      error: () => {
        setStatus("error")
        return "An unknown error occured."
      },
      success: () => {
        setStatus("success")
        return "Bug report sent!"
      },
    })
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col gap-8 *:w-full md:flex-row">
            <FormField
              control={form.control}
              name="subject"
              disabled={disabled}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Subject <Required />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Example: Something broke" {...field} />
                  </FormControl>
                  <FormDescription>
                    Give a brief description of the bug
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="urgency"
              disabled={disabled}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Urgency <Required />
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={field.disabled}
                      name={field.name}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">🟦 Low</SelectItem>
                        <SelectItem value="medium">🟨 Medium</SelectItem>
                        <SelectItem value="high">🟥 High</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select the urgency of the bug
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="body"
            disabled={disabled}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Body <Required />
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Example: Something breaks when I do X, Y, and Z"
                    autoResize
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Explain what went wrong and how to reproduce it
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-8 *:w-full md:flex-row">
            <FormField
              control={form.control}
              name="guildId"
              disabled={disabled}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Server ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Example: 123456789012345678"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The ID of the server the bug occured in (leave blank if this
                    doesn't apply)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="channelId"
              disabled={disabled}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Channel ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Example: 123456789012345678"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The ID of the channel the bug occured in (leave blank if
                    this doesn't apply)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={disabled} type="submit">
            {status === "loading"
              ? "Submitting..."
              : status === "success"
                ? "Submitted!"
                : "Submit report"}
          </Button>
        </form>
      </Form>
      <Toaster />
    </>
  )
}

export function Required() {
  return <span className="text-destructive">*</span>
}
