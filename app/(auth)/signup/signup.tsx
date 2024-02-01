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
import { LoaderIcon } from "lucide-react"
import Link from "next/link"
import Footer from "../_components/footer"
import { GoogleButton } from "../_components/oauth-button"
import { useSignUp } from "./_hooks/use-signup"
import { useAuthStore } from "@/store/use-auth-store"
import InputPassword from "@/components/form/input-password"

export default function SignUpPage() {
  const { errors, form, isLoadingSubmit, submitHandler } = useSignUp()
  const { signUpWithOauth } = useAuthStore()

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold md:text-4xl">Sign up</h1>

      <Form {...form}>
        <form
          onSubmit={submitHandler}
          className="flex w-full flex-col gap-y-3"
          autoComplete="off"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email address..."
                    type="text"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <InputPassword error={fieldState.error} field={field} />
                </FormControl>
                <FormMessage />

                <InputPassword.Validation password={field.value} />
              </FormItem>
            )}
          />

          <Button size="lg" className="w-full" type="submit" disabled={isLoadingSubmit}>
            {isLoadingSubmit && (
              <LoaderIcon className="animate mr-2 h-4 w-4 animate-spin" />
            )}
            Continue
          </Button>

          <ErrorBlock message={errors.root?.apiError.message} />
        </form>
      </Form>

      <hr className="my-8 w-full" />

      <GoogleButton clickHandler={() => signUpWithOauth({ provider: "google" })} />

      <div className="mt-5 flex justify-center gap-x-1 text-sm">
        <p>Have an account?</p>

        <Button variant="link-blue" className="h-auto p-0 font-normal" asChild>
          <Link href="/login">Log in here</Link>
        </Button>
      </div>

      <Footer />
    </>
  )
}
