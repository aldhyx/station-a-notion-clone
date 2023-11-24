"use client"

import ErrorBlock from "@/components/error-block"
import InputPasswordWrapper from "@/components/input-password-wrapper"
import { FacebookButton, GoogleButton } from "@/components/oauth-button"
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
import { signUpSchema, type SignUpSchema } from "@/lib/schemas/auth-schema"
import { supabase } from "@/lib/supabase/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import Footer from "../../_components/footer"

type Props = {
  setEmail: Dispatch<SetStateAction<string | undefined>>
}

export default function SignUpPage({ setEmail }: Props) {
  const router = useRouter()
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  })

  const submitHandler = form.handleSubmit(async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password })

      if (error) {
        // rate limit error
        if (error.status === 429) throw new Error("")
        throw new Error(error.message)
      }

      // Currently the response of signUp returns a fake user object instead of an error.
      // For now we check the identities object which would be empty if a user already exits.
      const isEmailTaken = data.user?.identities?.length === 0
      if (isEmailTaken) throw new Error("Email already in use")

      setEmail(email)
      router.push(`/signup?steps=2`)
    } catch (error) {
      form.setError("root.apiError", { message: getApiError(error) })
    }
  })

  const {
    formState: { isSubmitting, errors },
    watch,
  } = form

  const currentFormState = watch()
  const isDisableSubmit =
    isSubmitting || !currentFormState.email || !currentFormState.password
  const isLoadingSubmit = isSubmitting

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
                  <InputPasswordWrapper
                    peerClassName="password"
                    error={fieldState.error}
                    render={({ showPassword }) => (
                      <Input
                        className="peer/password border-0 "
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

          <Button
            size="lg"
            className="w-full"
            variant="outline-blue"
            type="submit"
            disabled={isDisableSubmit}
          >
            {isLoadingSubmit && (
              <LoaderIcon className="animate mr-2 h-4 w-4 animate-spin" />
            )}
            Continue with Email & Password
          </Button>

          <ErrorBlock message={errors.root?.apiError.message} />
        </form>
      </Form>

      <hr className="my-8 w-full border-zinc-200" />

      <GoogleButton />
      <FacebookButton />

      <div className="mt-6 flex justify-center gap-x-1 text-sm">
        <p className="text-zinc-700">Have an account?</p>

        <Button variant="link-blue" className="h-auto p-0 font-normal" asChild>
          <Link href="/login">Log in here</Link>
        </Button>
      </div>

      <Footer />
    </>
  )
}
