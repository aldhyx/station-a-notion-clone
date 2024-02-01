"use client"

import ErrorBlock from "@/components/error-block"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoaderIcon, MailCheckIcon } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import useForgotPasswordVerify from "./_hooks/use-forgot-password-verify"

export default function ForgotPasswordVerifyPage() {
  const { errors, form, isLoadingSubmit, submitHandler } = useForgotPasswordVerify()

  const params = useSearchParams()
  const email = params.get("mailto")

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
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button size="lg" className="w-full" type="submit" disabled={isLoadingSubmit}>
            {isLoadingSubmit && (
              <LoaderIcon className="animate mr-2 h-4 w-4 animate-spin" />
            )}
            Continue to Reset Password
          </Button>

          <ErrorBlock message={errors.root?.apiError.message} />
        </form>
      </Form>

      <hr className="my-8 w-full" />

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
