"use client"

import ErrorBlock from "@/components/error-block"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { getApiError } from "@/lib/error/api-error"
import {
  emailVerificationSchema,
  type EmailVerificationSchema,
} from "@/lib/schemas/auth-schema"
import { supabase } from "@/lib/supabase/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderIcon, LockIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"

type Props = {
  setEmail: Dispatch<SetStateAction<string | undefined>>
}
export default function ForgotPasswordPage({ setEmail }: Props) {
  const router = useRouter()
  const form = useForm<EmailVerificationSchema>({
    resolver: zodResolver(emailVerificationSchema),
  })

  const submitHandler = form.handleSubmit(async ({ email }) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)

      if (error) throw new Error(error.message)

      setEmail(email)
      router.push("/forgot-password?steps=2")
    } catch (error) {
      form.setError("root.apiError", { message: getApiError(error) })
    }
  })

  const {
    formState: { isSubmitting, errors },
    watch,
  } = form

  const currentFormState = watch()
  const isDisableSubmit = isSubmitting || !currentFormState.email
  const isLoadingSubmit = isSubmitting

  return (
    <>
      <LockIcon className="mb-3 h-20 w-20" />
      <h1 className="mb-8 text-3xl font-bold md:text-4xl">Forgot password</h1>
      <p className="mb-3 w-full text-left text-sm">
        Enter email address associated with your account, we&apos;ll send you a link with
        instruction to reset your password.
      </p>

      <Form {...form}>
        <form
          onSubmit={submitHandler}
          className="flex w-full flex-col gap-y-3"
          autoComplete="off"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Enter your email address..."
                    type="text"
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
            Send Instruction Link
          </Button>

          <ErrorBlock message={errors.root?.apiError.message} />

          <hr className="my-8 w-full border-zinc-200" />

          <div className="mt-0 flex justify-center gap-x-1 text-sm">
            <p className="text-zinc-700">Don&apos;t have an account?</p>

            <Button variant="link-blue" className="h-auto p-0 font-normal" asChild>
              <Link href="/signup">Sign up here</Link>
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}
