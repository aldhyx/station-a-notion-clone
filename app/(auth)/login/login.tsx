import Footer from "@/app/(auth)/_component/footer"
import ErrorBlock from "@/components/error-block"
import InputPasswordWrapper from "@/components/input-password-wrapper"
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
import { FacebookButton, GoogleButton } from "../_component/oauth-button"
import { useLogin } from "./_hook/use-login"

export default function LoginPage() {
  const { errors, form, isDisableSubmit, isLoadingSubmit, submitHandler } = useLogin()

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
                    error={fieldState.error}
                    render={({ showPassword }) => (
                      <Input
                        className="peer border-0 "
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
