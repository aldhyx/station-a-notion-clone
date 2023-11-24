"use client"

import ErrorBlock from "@/components/error-block"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { getApiError } from "@/lib/error/api-error"
import { otpSchema, type OTPSchema } from "@/lib/schemas/auth-schema"
import { supabase } from "@/lib/supabase/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderIcon, MailCheckIcon } from "lucide-react"
import Link from "next/link"
import { redirect, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

type Props = { email: string | undefined }

export default function ForgotPasswordVerificationPage({ email }: Props) {
  const router = useRouter()

  const form = useForm<OTPSchema>({
    resolver: zodResolver(otpSchema),
  })

  const submitHandler = form.handleSubmit(async ({ code }) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email!,
        token: code,
        type: "recovery",
      })

      if (error) {
        // rate limit error
        if (error.status === 429) throw new Error("")
        throw new Error(error.message)
      }

      router.replace("/reset-password")
    } catch (error) {
      form.setError("root.apiError", { message: getApiError(error) })
    }
  })

  const {
    formState: { isSubmitting, isValid, errors },
  } = form

  const isDisableSubmit = !isValid || isSubmitting
  const isLoadingSubmit = isSubmitting

  if (!email) return redirect("/forgot-password")

  return (
    <>
      <MailCheckIcon className="mb-3 h-20 w-20" />
      <h1 className="mb-8 text-3xl font-bold md:text-4xl">Check your email</h1>
      <p className="mb-3 w-full text-left text-sm">
        We have sent the verification code to <strong>{email}</strong>. Please, enter the
        code down below to reset your password.
      </p>

      <Form {...form}>
        <form
          onSubmit={submitHandler}
          className="flex w-full flex-col gap-y-3"
          autoComplete="off"
        >
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Enter the verification code..."
                    type="text"
                    inputSize="lg"
                    {...field}
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
            Continue to Reset Password
          </Button>

          <ErrorBlock message={errors.root?.apiError.message} />
        </form>
      </Form>

      <hr className="my-8 w-full border-zinc-200" />

      <div className="w-full text-left text-sm">
        <p className="mb-2 font-medium">Didn&apos;t receive email? </p>
        <ol className="list-inside list-disc">
          <li>Check your spam or junk folder.</li>
          <li>
            <Button variant="link-blue" className="h-auto p-0 font-normal" asChild>
              <Link href="/forgot-password">Click here</Link>
            </Button>{" "}
            to try another email address
          </li>
        </ol>
      </div>
    </>
  )
}
