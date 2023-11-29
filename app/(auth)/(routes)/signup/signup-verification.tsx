"use client"

import ErrorBlock from "@/components/error-block"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { getApiError } from "@/lib/error/api-error"
import { otpSchema, type OTPSchema } from "@/lib/schemas/auth-schema"
import { supabase } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderIcon, MailCheckIcon } from "lucide-react"
import { redirect, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { useCountdown } from "usehooks-ts"

type Props = { email: string | undefined }

export default function SignUpVerificationPage({ email }: Props) {
  const router = useRouter()

  const [count, { startCountdown }] = useCountdown({
    countStart: 60,
  })
  const showCountdown = count != 0 && count < 60

  const form = useForm<OTPSchema>({
    resolver: zodResolver(otpSchema),
  })

  const submitHandler = form.handleSubmit(async ({ code }) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email!,
        token: code,
        type: "email",
      })

      if (error) {
        // rate limit error
        if (error.status === 429) throw new Error("")
        // user not found
        if (error.status === 404) return router.replace(`/signup`)

        throw new Error(error.message)
      }

      router.replace("/pages")
    } catch (error) {
      form.setError("root.apiError", { message: getApiError(error) })
    }
  })

  const resendHandler = async () => {
    startCountdown()
    try {
      const { error } = await supabase.auth.resend({ type: "signup", email: email! })

      if (error) {
        // rate limit error
        if (error.status === 429) throw new Error("")
        throw new Error(error.message)
      }

      form.setError("root.apiError", { message: undefined })
    } catch (error) {
      form.setError("root.apiError", { message: getApiError(error) })
    }
  }

  const {
    formState: { isSubmitting, isValid, errors },
  } = form

  const isDisableSubmit = !isValid || isSubmitting
  const isLoadingSubmit = isSubmitting

  if (!email) return redirect("/signup")

  return (
    <>
      <MailCheckIcon className="mb-4 h-16 w-16" />

      <h1 className="mb-2 text-2xl font-bold md:text-3xl">Check your email</h1>

      <p className="mb-8 w-full text-center text-sm">
        To complete your signup, we&apos;ve sent the verification code to{" "}
        <strong>{email}</strong> to verify your email.
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
            Verify Email
          </Button>

          <ErrorBlock message={errors.root?.apiError.message} />
        </form>
      </Form>

      <hr className="my-8 w-full border-zinc-200" />

      <div className="w-full text-left text-sm">
        <p className="mb-2 font-medium">Didn&apos;t receive email ?</p>
        <ol className="list-inside list-disc">
          <li>Check your spam or junk folder.</li>
          <li>
            <Button
              variant="link-blue"
              className={cn("h-auto p-0", showCountdown && "no-underline")}
              onClick={resendHandler}
              disabled={showCountdown}
            >
              {showCountdown
                ? `Resend verification code again in (${count}s)`
                : !showCountdown && "Click here"}
            </Button>
            {!showCountdown && ` to resend the verification code.`}
          </li>
        </ol>
      </div>
    </>
  )
}
