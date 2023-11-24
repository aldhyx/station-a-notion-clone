"use client"

import SignOutDialog from "@/components/dialogs/sign-out-dialog"
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
import { LoaderIcon, PartyPopperIcon, UnlockIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const signUpSchema = z
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

export default function ResetPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
  })

  const submitHandler = form.handleSubmit(async ({ password }) => {
    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) throw new Error(error.message)
      setIsSuccess(true)
    } catch (error) {
      form.setError("root.apiError", { message: getApiError(error) })
    }
  })

  const {
    formState: { isSubmitting, errors },
    watch,
  } = form

  const currentFormState = watch()
  const isDisableSubmit =
    isSubmitting || !currentFormState.confirm_password || !currentFormState.password
  const isLoadingSubmit = isSubmitting

  if (isSuccess) {
    return (
      <>
        <PartyPopperIcon className="mb-8 h-20 w-20" />
        <h1 className="mb-2 text-3xl font-bold md:text-4xl">Success</h1>{" "}
        <p className="mb-6 w-full text-center text-sm">
          Successfully create new password.
        </p>
        <div className="flex w-full flex-col gap-y-2">
          <Button variant="default" onClick={() => router.replace("/docs")}>
            Go to dashboard
          </Button>
          <SignOutDialog>
            <Button variant="ghost">Log out</Button>
          </SignOutDialog>
        </div>
      </>
    )
  }

  return (
    <>
      <UnlockIcon className="mb-3 h-20 w-20" />
      <h1 className="mb-8 text-3xl font-bold md:text-4xl">Create New password</h1>

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
                    peerClassName="password"
                    error={fieldState.error}
                    render={({ showPassword }) => (
                      <Input
                        className="peer/password border-0 "
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
                    peerClassName="cpassword"
                    error={fieldState.error}
                    render={({ showPassword }) => (
                      <Input
                        className="peer/cpassword border-0 "
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

          <Button
            size="lg"
            className="w-full"
            variant="outline-blue"
            type="submit"
            disabled={isDisableSubmit}
          >
            {isLoadingSubmit && (
              <LoaderIcon className="animate mr-2 h-4 w-4 animate-spin" />
            )}
            Submit
          </Button>

          <ErrorBlock message={errors.root?.apiError.message} />
        </form>
      </Form>
    </>
  )
}
