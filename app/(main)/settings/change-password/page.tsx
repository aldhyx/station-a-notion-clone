"use client"

import ErrorBlock from "@/components/error-block"
import InputPasswordWrapper from "@/components/input-password-wrapper"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { getApiError } from "@/lib/error/api-error"
import { supabase } from "@/lib/supabase/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderIcon, PartyPopperIcon } from "lucide-react"
import Link from "next/link"
import { PropsWithChildren } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const passwordSchema = z
  .object({
    password: z
      .string({
        required_error: "Invalid password",
      })
      .min(8, {
        message: "Password must contain at least 8 character(s)",
      })
      .max(72, {
        message: "Password must contain at most 72 character(s)",
      })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+/, {
        message:
          "Password must contain at least one lowercase letter, one uppercase letter, and one digit (0-9).",
      }),
    confirm_password: z
      .string({
        required_error: "Invalid confirm password",
      })
      .min(8, {
        message: "Invalid confirm password",
      })
      .max(72, {
        message: "Invalid confirm password",
      })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+/, {
        message: "Invalid confirm password",
      }),
  })
  .superRefine((arg, ctx) => {
    if (arg.password !== arg.confirm_password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirm_password"],
        message: "Password & confirm password does not match!",
      })
    }
    return z.NEVER
  })

export default function ChangePasswordDialog({ children }: PropsWithChildren) {
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
  })

  const submitHandler = form.handleSubmit(async ({ password }) => {
    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) throw new Error(error.message)
    } catch (error) {
      form.setError("root.apiError", { message: getApiError(error) })
    }
  })

  const {
    formState: { isSubmitting, errors, isSubmitSuccessful },
    watch,
  } = form

  const currentFormState = watch()
  const isDisableSubmit =
    isSubmitting || !currentFormState.confirm_password || !currentFormState.password
  const isLoadingSubmit = isSubmitting

  if (isSubmitSuccessful) {
    return (
      <div className="mx-auto mt-16 max-w-md">
        <div className="flex w-full flex-col items-center justify-center">
          <PartyPopperIcon className="mb-8 h-20 w-20" />
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">Success</h1>{" "}
          <p className="w-full text-center text-sm">
            Your password has been change successfully.
          </p>
          <Button asChild className="mt-3" variant="secondary">
            <Link href="/settings">Back to settings</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto mt-8 max-w-md px-4">
      <h1 className="mb-8 text-center text-xl font-medium leading-none">
        Change password
      </h1>

      <Form {...form}>
        <form
          onSubmit={submitHandler}
          className="flex w-full flex-col gap-y-3"
          autoComplete="off"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <InputPasswordWrapper
                    error={fieldState.error}
                    render={({ showPassword }) => (
                      <Input
                        className="peer border-0 "
                        placeholder={showPassword ? "Enter your password..." : "********"}
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />
                    )}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <InputPasswordWrapper
                    error={fieldState.error}
                    render={({ showPassword }) => (
                      <Input
                        className="peer border-0 "
                        placeholder={
                          showPassword ? "Enter your confirm password..." : "********"
                        }
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />
                    )}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <ErrorBlock className="m-0 mt-5" message={errors.root?.apiError.message} />

          <Button size="lg" className="w-full" type="submit" disabled={isDisableSubmit}>
            {isLoadingSubmit && (
              <LoaderIcon className="animate mr-2 h-4 w-4 animate-spin" />
            )}
            Submit
          </Button>
        </form>
      </Form>
    </div>
  )
}
