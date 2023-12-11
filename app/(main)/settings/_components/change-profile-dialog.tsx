"use client"

import ErrorBlock from "@/components/error-block"
import { Button } from "@/components/ui/button"
import {
  Dialog,
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
import { FormInput, LoaderIcon, PartyPopperIcon } from "lucide-react"
import { PropsWithChildren } from "react"
import { useChangeProfile } from "../_hooks/use-change-profile"

export default function ChangeProfileDialog({ children }: PropsWithChildren) {
  const {
    form,
    errors,
    isSubmitSuccessful,
    isDisableSubmit,
    isLoadingSubmit,
    resetFormHandler,
    submitHandler,
  } = useChangeProfile()

  return (
    <Dialog onOpenChange={resetFormHandler}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      {isSubmitSuccessful ? (
        <DialogContent className="top-[5%] w-[90%] translate-y-[0] gap-0 rounded-xl px-3 pb-6 pt-14 md:max-w-sm">
          <div className="flex w-full flex-col items-center justify-center">
            <PartyPopperIcon className="mb-8 h-20 w-20" />
            <h1 className="mb-2 text-3xl font-bold md:text-4xl">Success</h1>
            <p className="w-full text-center text-sm">
              Profile has been changed successfully.
            </p>
          </div>
        </DialogContent>
      ) : (
        <DialogContent
          className="top-[5%] w-[90%] translate-y-[0] gap-0 rounded-xl px-3 pb-6 pt-14 md:max-w-sm"
          onInteractOutside={e => {
            return e.preventDefault()
          }}
        >
          <DialogHeader className="mb-8">
            <FormInput className="mx-auto mb-2" />
            <p className="!text-center text-lg font-medium leading-none">
              Change Profile
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
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name..." type="text" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your username..."
                        type="text"
                        {...field}
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
                Change profile
              </Button>
            </form>
          </Form>
        </DialogContent>
      )}
    </Dialog>
  )
}
