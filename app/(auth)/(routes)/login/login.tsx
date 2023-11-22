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
import { supabase } from "@/lib/supabase/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Footer from "../../_components/footer"

const signInSchema = z.object({
  email: z
    .string({
      required_error: "Invalid email address",
    })
    .email({ message: "Invalid email address" })
    .toLowerCase(),
  password: z.string(),
})

type Props = {
  setEmail: Dispatch<SetStateAction<string | undefined>>
}

export default function LoginPage({ setEmail }: Props) {
  const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
  })

  const submitHandler = form.handleSubmit(async ({ email, password }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        if (error.message.toLowerCase() === "email not confirmed") {
          setEmail(email)
          return router.push(`/login?steps=2`)
        }

        throw new Error(
          error.status === 400 ? "Invalid email or password" : error.message,
        )
      }

      router.push("/docs")
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
      <h1 className="mb-8 text-3xl font-bold md:text-4xl">Log in</h1>

      <GoogleButton />
      <FacebookButton />

      <hr className="my-8 w-full border-zinc-200" />

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

          <Button variant="link-blue" className="my-3 h-auto p-0 font-normal" asChild>
            <Link href="/forgot-password">Forgot password?</Link>
          </Button>

          <div className="mt-0 flex justify-center gap-x-1 text-sm">
            <p className="text-zinc-700">Don&apos;t have an account?</p>

            <Button variant="link-blue" className="h-auto p-0 font-normal" asChild>
              <Link href="/signup">Sign up here</Link>
            </Button>
          </div>
        </form>
      </Form>

      <Footer />
    </>
  )
}
