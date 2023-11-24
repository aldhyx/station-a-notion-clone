import ErrorBlock from "@/components/error-block"
import { Button } from "@/components/ui/button"
import { DialogContent, DialogHeader } from "@/components/ui/dialog"
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
import {
  emailVerificationSchema,
  type EmailVerificationSchema,
} from "@/lib/schemas/auth-schema"
import { supabase } from "@/lib/supabase/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderIcon, MailIcon } from "lucide-react"
import { type Dispatch, type SetStateAction } from "react"
import { useForm } from "react-hook-form"

type Props = {
  nextSteps: () => void
  setNewEmail: Dispatch<SetStateAction<string>>
}

export default function RequestDialogContent({ nextSteps, setNewEmail }: Props) {
  const form = useForm<EmailVerificationSchema>({
    resolver: zodResolver(emailVerificationSchema),
  })

  const submitHandler = form.handleSubmit(async ({ email }) => {
    try {
      const { error } = await supabase.auth.updateUser({ email })

      if (error) throw new Error(error.message)

      setNewEmail(email)
      nextSteps()
    } catch (error) {
      form.setError("root.apiError", { message: getApiError(error) })
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
    clearErrors("email")
  }

  const currentFormState = watch()
  const isDisableSubmit = isSubmitting || !currentFormState.email
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
        <p className="!text-center text-lg font-medium leading-none">Change Email</p>
      </DialogHeader>

      <Form {...form}>
        <form
          onSubmit={submitHandler}
          className="flex w-full flex-col gap-y-3"
          autoComplete="off"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>New email</FormLabel>
                <FormControl>
                  <Input placeholder={"Enter new email..."} type={"text"} {...field} />
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
            Continue to change email
          </Button>
        </form>
      </Form>
    </DialogContent>
  )
}
