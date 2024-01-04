"use client"

import ErrorBlock from "@/components/error-block"
import InputPasswordWrapper from "@/components/input-password-wrapper"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoaderIcon, LockKeyholeIcon } from "lucide-react"
import { PropsWithChildren } from "react"
import { useResetPassword } from "../_hooks/use-reset-password"

export default function ChangePasswordDialog({ children }: PropsWithChildren) {
  const {
    errors,
    form,
    isDisableSubmit,
    isLoadingSubmit,
    resetFormHandler,
    submitHandler,
    closeButtonRef,
  } = useResetPassword()

  return (
    <Dialog onOpenChange={resetFormHandler}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        className="top-[5%] w-[90%] translate-y-[0] gap-0 rounded-xl px-3 pb-6 pt-14 md:max-w-sm"
        onInteractOutside={e => {
          return e.preventDefault()
        }}
      >
        <DialogHeader className="mb-8 dark:text-zinc-100">
          <LockKeyholeIcon className="mx-auto mb-2" />
          <p className="!text-center text-lg font-medium leading-none">Change Password</p>
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

            <Button size="lg" className="w-full" type="submit" disabled={isDisableSubmit}>
              {isLoadingSubmit && (
                <LoaderIcon className="animate mr-2 h-4 w-4 animate-spin" />
              )}
              Submit
            </Button>

            <DialogClose hidden>
              <button type="button" ref={closeButtonRef}>
                close
              </button>
            </DialogClose>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
