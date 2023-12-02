"use client"

import ErrorBlock from "@/components/error-block"
import InputPasswordWrapper from "@/components/input-password-wrapper"
import { Button } from "@/components/ui/button"
import { getApiError } from "@/lib/error/api-error"
import { resetPasswordSchema, type ResetPasswordSchema } from "@/lib/schemas/auth-schema"
import { supabase } from "@/lib/supabase/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderIcon, LockKeyholeIcon, PartyPopperIcon, XCircle } from "lucide-react"
import { PropsWithChildren } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "../ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"

export default function ChangePasswordDialog({ children }: PropsWithChildren) {
  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const submitHandler = form.handleSubmit(async ({ password }) => {
    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) throw new Error(error.message)
      toast.success("Password has been changed successfully.")
    } catch (error) {
      form.setError("root.apiError", { message: getApiError(error) })

      toast.error("Failed to change password.", {
        icon: <XCircle className="h-5 w-5 text-zinc-50" />,
        classNames: {
          toast: "!bg-red-500 !border-red-500",
          title: "!text-zinc-50",
        },
        duration: 6000,
      })
    }
  })

  const {
    formState: { isSubmitting, errors, isSubmitSuccessful },
    watch,
    clearErrors,
    reset,
  } = form

  const resetForm = () => {
    reset()
    clearErrors(["confirm_password", "password"])
  }
  const currentFormState = watch()
  const isDisableSubmit =
    isSubmitting || !currentFormState.confirm_password || !currentFormState.password
  const isLoadingSubmit = isSubmitting

  return (
    <Dialog onOpenChange={resetForm}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      {isSubmitSuccessful ? (
        <DialogContent className="top-[5%] max-w-sm translate-y-[0] gap-0 px-4 pb-10 pt-14">
          <div className="flex w-full flex-col items-center justify-center">
            <PartyPopperIcon className="mb-8 h-20 w-20" />
            <h1 className="mb-2 text-3xl font-bold md:text-4xl">Success</h1>
            <p className="w-full text-center text-sm">
              Password has been changed successfully.
            </p>
          </div>
        </DialogContent>
      ) : (
        <DialogContent
          className="top-[5%] max-w-sm translate-y-[0] gap-0  px-4 pb-6 pt-14"
          onInteractOutside={e => {
            return e.preventDefault()
          }}
        >
          <DialogHeader className="mb-8">
            <LockKeyholeIcon className="mx-auto mb-2" />
            <p className="!text-center text-lg font-medium leading-none">
              Change Password
            </p>
          </DialogHeader>

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
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <InputPasswordWrapper
                        error={fieldState.error}
                        render={({ showPassword }) => (
                          <Input
                            className="peer border-0 "
                            placeholder={
                              showPassword ? "Enter new password..." : "********"
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

              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Confirm new password</FormLabel>
                    <FormControl>
                      <InputPasswordWrapper
                        error={fieldState.error}
                        render={({ showPassword }) => (
                          <Input
                            className="peer border-0 "
                            placeholder={
                              showPassword ? "Enter new confirm password..." : "********"
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

              <Button
                size="lg"
                className="w-full"
                type="submit"
                disabled={isDisableSubmit}
              >
                {isLoadingSubmit && (
                  <LoaderIcon className="animate mr-2 h-4 w-4 animate-spin" />
                )}
                Change password
              </Button>
            </form>
          </Form>
        </DialogContent>
      )}
    </Dialog>
  )
}
