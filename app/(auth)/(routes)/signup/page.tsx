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
import { supabase } from "@/lib/supabase/config"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"

const signUpSchema = z.object({
  email: z
    .string({
      required_error: "Invalid email address",
    })
    .email({ message: "Invalid email address" })
    .toLowerCase(),
  password: z
    .string({
      required_error: "Invalid password",
    })
    .min(8, {
      message: "Password must contain at least 8 character(s)",
    })
    .max(72, {
      message: "Password must contain at most 72 character(s)",
    })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+/, {
      message:
        "Password must contain at least one lowercase letter, one uppercase letter, and one digit (0-9).",
    }),
})

export default function SignUpPage() {
  const router = useRouter()

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
  })

  const submitHandler = form.handleSubmit(async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        // rate limit error
        if (error.status === 429) throw new Error("")
        throw new Error(error.message)
      }

      // Currently the response of signUp returns a fake user object instead of an error.
      // For now we check the identities object which would be empty if a user already exits.
      const isEmailTaken = data.user?.identities?.length === 0
      if (isEmailTaken) {
        throw new Error("Email already in use")
      }

      router.push(`/signup-verification?mailto=${email}`)
    } catch (error) {
      form.setError("root.apiError", {
        message:
          error instanceof Error && error.message && typeof error.message === "string"
            ? error.message
            : "Something went wrong! Try again in a few minutes",
      })
    }
  })

  const {
    formState: { isSubmitting, isValid, errors },
    watch,
  } = form

  const password = watch("password")
  const isDisableSubmit = !password || !isValid || isSubmitting

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold md:text-5xl">Sign up</h1>

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
            {isSubmitting && <LoaderIcon className="animate mr-2 h-4 w-4 animate-spin" />}
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
    </>
  )
}
