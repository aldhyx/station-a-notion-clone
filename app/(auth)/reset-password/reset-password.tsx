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
import { LoaderIcon, LockKeyholeIcon, PartyPopperIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useResetPassword } from "./_hook/use-reset-password"

export default function ResetPasswordPage() {
  const router = useRouter()
  const { errors, form, isDisableSubmit, isLoadingSubmit, isSuccess, submitHandler } =
    useResetPassword()

  if (isSuccess) {
    return (
      <>
        <PartyPopperIcon className="mb-8 h-20 w-20" />
        <h1 className="mb-2 text-3xl font-bold md:text-4xl">Success</h1>{" "}
        <p className="mb-6 w-full text-center text-sm">
          Password has been changed successfully.
        </p>
        <div className="flex w-full flex-col gap-y-2">
          <Button variant="default" onClick={() => router.replace("/pages")}>
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
      <LockKeyholeIcon className="mb-3 h-16 w-16" />
      <h1 className="mb-8 text-3xl font-bold md:text-4xl">Create new password</h1>

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
            Change password
          </Button>
        </form>
      </Form>
    </>
  )
}
