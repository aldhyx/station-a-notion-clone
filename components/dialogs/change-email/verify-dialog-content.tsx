import ErrorBlock from "@/components/error-block"
import { Button } from "@/components/ui/button"
import { DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { getApiError } from "@/lib/error/api-error"
import { OTPSchema, otpSchema } from "@/lib/schemas/auth-schema"
import { supabase } from "@/lib/supabase/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderIcon, MailIcon, XCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

type Props = {
  nextSteps: () => void
  prevSteps: () => void
  newEmail: string
}

export default function VerifyDialogContent({ nextSteps, newEmail, prevSteps }: Props) {
  const form = useForm<OTPSchema>({
    resolver: zodResolver(otpSchema),
  })

  const submitHandler = form.handleSubmit(async ({ code }) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: newEmail!,
        token: code,
        type: "email_change",
      })

      if (error) throw new Error(error.message)

      toast.success("Email has been changed successfully.")
      nextSteps()
    } catch (error) {
      form.setError("root.apiError", { message: getApiError(error) })

      toast.error("Failed to change email.", {
        icon: <XCircle className="h-5 w-5 text-zinc-50" />,
        classNames: {
          toast: "!bg-red-600 !border-red-600",
          title: "!text-zinc-50",
        },
        duration: 6000,
      })
    }
  })

  const {
    formState: { isSubmitting, errors },
    watch,
    clearErrors,
    reset,
  } = form

  const resetForm = () => {
    reset()
    clearErrors("code")
  }

  const currentFormState = watch()
  const isDisableSubmit = isSubmitting || !currentFormState.code
  const isLoadingSubmit = isSubmitting

  return (
    <DialogContent
      className="top-[5%] max-w-sm translate-y-[0] gap-0  px-4 pb-6 pt-14"
      onInteractOutside={e => {
        return e.preventDefault()
      }}
      onCloseAutoFocus={e => {
        if (isSubmitting) return e.preventDefault()
        resetForm()
      }}
    >
      <DialogHeader className="mb-8">
        <MailIcon className="mx-auto mb-2" />
        <p className="mb-2 !text-center text-lg font-medium leading-none">Change Email</p>
        <p className="text-center text-sm">
          To change your email, we&apos;ve sent the verification code to{" "}
          <strong>{newEmail}</strong>.
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
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Enter the verification code..."
                    type="text"
                    inputSize="lg"
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
            Change Email
          </Button>
        </form>
      </Form>

      <hr className="my-8 w-full border-zinc-200" />

      <div className="w-full text-left text-sm">
        <p className="mb-2 font-medium">Didn&apos;t receive email? </p>
        <ol className="list-inside list-disc">
          <li>Check your spam or junk folder.</li>
          <li>
            <Button
              variant="link-blue"
              className="h-auto p-0 font-normal"
              onClick={prevSteps}
            >
              Click here
            </Button>{" "}
            to try another email address
          </li>
        </ol>
      </div>
    </DialogContent>
  )
}
