import { getApiError } from "@/lib/error/api-error"
import { resetPasswordSchema, type ResetPasswordSchema } from "@/lib/schemas/auth-schema"
import { supabase } from "@/lib/supabase/client"
import { simulateAsync } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderIcon, PartyPopperIcon } from "lucide-react"
import { PropsWithChildren } from "react"
import { useForm } from "react-hook-form"
import ErrorBlock from "../error-block"
import InputPasswordWrapper from "../input-password-wrapper"
import { Button } from "../ui/button"
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
      await simulateAsync()
      const { error } = await supabase.auth.updateUser({ password })

      if (error) throw new Error(error.message)
    } catch (error) {
      form.setError("root.apiError", { message: getApiError(error) })
    }
  })

  const {
    formState: { isSubmitting, errors, isSubmitSuccessful },
    watch,
    clearErrors,
    reset,
  } = form

  const currentFormState = watch()
  const isDisableSubmit =
    isSubmitting || !currentFormState.confirm_password || !currentFormState.password
  const isLoadingSubmit = isSubmitting

  return (
    <Dialog
      onOpenChange={() => {
        reset()
        clearErrors(["confirm_password", "password"])
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>

      {isSubmitting || isSubmitSuccessful ? (
        <DialogContent
          className="top-[10%] h-80 max-w-sm translate-y-[0] gap-0 overflow-hidden rounded-sm bg-zinc-50 p-0"
          hideCloseButton
          onInteractOutside={e => {
            if (isSubmitting) e.preventDefault()
          }}
        >
          <div className="flex w-full flex-col items-center justify-center">
            {isSubmitting && <LoaderIcon className="h-20 w-20 animate-spin" />}
            {isSubmitSuccessful && (
              <>
                <PartyPopperIcon className="mb-8 h-20 w-20" />
                <h1 className="mb-2 text-3xl font-bold md:text-4xl">Success</h1>{" "}
                <p className="w-full text-center text-sm">
                  Successfully change password.
                </p>
              </>
            )}
          </div>
        </DialogContent>
      ) : (
        <DialogContent
          className="top-[10%] max-w-sm translate-y-[0] gap-0 overflow-hidden rounded-sm bg-zinc-50 p-0 py-8"
          hideCloseButton
          onInteractOutside={e => {
            if (isSubmitting) e.preventDefault()
          }}
        >
          <DialogHeader className="mb-8 px-4 !text-center text-lg font-medium leading-none">
            Change password
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={submitHandler}
              className="flex w-full flex-col gap-y-3 px-4"
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
                            placeholder={
                              showPassword ? "Enter your password..." : "********"
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
                Submit
              </Button>
            </form>
          </Form>
        </DialogContent>
      )}
    </Dialog>
  )
}
