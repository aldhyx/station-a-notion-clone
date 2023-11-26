"use client"

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
import { getApiError } from "@/lib/error/api-error"
import { ProfileSchema, profileSchema } from "@/lib/schemas/auth-schema"
import { simulateAsync } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormInput, LoaderIcon, PartyPopperIcon, XCircle } from "lucide-react"
import { PropsWithChildren } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import ErrorBlock from "../error-block"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

export default function ChangeProfileDialog({ children }: PropsWithChildren) {
  const form = useForm<ProfileSchema>({ resolver: zodResolver(profileSchema) })

  const submitHandler = form.handleSubmit(async ({ name, username }) => {
    try {
      //   const { error } = await supabase.auth.updateUser({ password })
      await simulateAsync()

      //   if (error) throw new Error(error.message)
      toast.success("Profile has been changed successfully.")
    } catch (error) {
      form.setError("root.apiError", { message: getApiError(error) })

      toast.error("Failed to change profile.", {
        icon: <XCircle className="h-5 w-5 text-zinc-50" />,
        classNames: {
          toast: "!bg-red-500 !border-red-500",
          title: "!text-zinc-50",
        },
        duration: 6000,
      })
    }
  })

  const resetForm = () => {
    reset()
    clearErrors(["name", "username"])
  }

  const {
    formState: { isSubmitting, errors, isSubmitSuccessful },
    watch,
    clearErrors,
    reset,
  } = form

  const currentFormState = watch()
  const isDisableSubmit =
    isSubmitting || !currentFormState.name || !currentFormState.username
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
              Profile has been changed successfully.
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
                name="name"
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
