"use client"

import ErrorBlock from "@/components/error-block"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { LoaderIcon, MailCheckIcon } from "lucide-react"
import { useSearchParams } from "next/navigation"
import useSignUpVerify from "./_hooks/use-signup-verify"

export default function SignUpVerifyPage() {
  const params = useSearchParams()
  const email = params.get("mailto")
  const {
    errors,
    form,
    isLoadingSubmit,
    resendHandler,
    showCountdown,
    submitHandler,
    count,
  } = useSignUpVerify()

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
            Verify Email
          </Button>

          <ErrorBlock message={errors.root?.apiError.message} />
        </form>
      </Form>

      <hr className="my-8 w-full " />

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
