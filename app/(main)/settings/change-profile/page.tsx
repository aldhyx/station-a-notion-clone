"use client"

import ErrorBlock from "@/components/error-block"
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
import { getApiError } from "@/lib/error/api-error"
import { profileSchema, type ProfileSchema } from "@/lib/schemas/auth-schema"
import { simulateAsync } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderIcon, PartyPopperIcon } from "lucide-react"
import Link from "next/link"
import { PropsWithChildren } from "react"
import { useForm } from "react-hook-form"

export default function ChangeProfilePage({ children }: PropsWithChildren) {
  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
  })

  const submitHandler = form.handleSubmit(async ({ name, username }) => {
    try {
      await simulateAsync()
    } catch (error) {
      form.setError("root.apiError", { message: getApiError(error) })
    }
  })

  const {
    formState: { isSubmitting, errors, isSubmitSuccessful },
    watch,
  } = form

  const currentFormState = watch()
  const isDisableSubmit =
    isSubmitting || !currentFormState.name || !currentFormState.username
  const isLoadingSubmit = isSubmitting

  if (isSubmitSuccessful) {
    return (
      <div className="mx-auto mt-16 max-w-md">
        <div className="flex w-full flex-col items-center justify-center">
          <PartyPopperIcon className="mb-8 h-20 w-20" />
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">Success</h1>{" "}
          <p className="w-full text-center text-sm">
            Your profile has been updated successfully.
          </p>
          <Button asChild className="mt-3" variant="secondary">
            <Link href="/settings">Back to settings</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto mt-8 max-w-md px-4">
      <h1 className="mb-8 text-center text-xl font-medium leading-none">
        Change profile
      </h1>

      <Form {...form}>
        <form
          onSubmit={submitHandler}
          className="flex w-full flex-col gap-y-3"
          autoComplete="off"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder={"Enter your name..."} type={"text"} {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder={"Enter your username..."}
                    type={"text"}
                    {...field}
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
        </form>
      </Form>
    </div>
  )
}
