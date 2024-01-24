"use client"

import ErrorBlock from "@/components/error-block"
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
import { LoaderIcon, LockKeyholeIcon } from "lucide-react"
import { PropsWithChildren } from "react"
import { useResetPassword } from "../_hooks/use-reset-password"
import InputPassword from "@/components/form/input-password"

export default function ChangePasswordDialog({ children }: PropsWithChildren) {
  const {
    errors,
    form,
    isLoadingSubmit,
    resetFormHandler,
    submitHandler,
    closeButtonRef,
  } = useResetPassword()

  return (
    <Dialog onOpenChange={resetFormHandler}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="top-[5%] w-[90%] translate-y-[0] gap-0 rounded-xl px-3 pb-6 pt-14 md:max-w-sm">
        <DialogHeader className="mb-8 ">
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
                    <InputPassword
                      placeholder="Enter new password..."
                      error={fieldState.error}
                      field={field}
                    />
                  </FormControl>

                  <FormMessage />
                  <InputPassword.Validation
                    password={field.value}
                    prefix="New password"
                  />
                </FormItem>
              )}
            />

            <Button size="lg" className="w-full" type="submit" disabled={isLoadingSubmit}>
              {isLoadingSubmit && (
                <LoaderIcon className="animate mr-2 h-4 w-4 animate-spin" />
              )}
              Submit
            </Button>

            <ErrorBlock message={errors.root?.apiError.message} />

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
