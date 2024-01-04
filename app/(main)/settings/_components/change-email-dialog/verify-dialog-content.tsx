import ErrorBlock from "@/components/error-block"
import { Button } from "@/components/ui/button"
import { DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoaderIcon, MailIcon } from "lucide-react"
import { useVerifyEmail } from "../../_hooks/use-verify-email"

type Props = {
  nextSteps: () => void
  prevSteps: () => void
  newEmail: string
}

export default function VerifyDialogContent({ nextSteps, newEmail, prevSteps }: Props) {
  const {
    errors,
    form,
    isDisableSubmit,
    isLoadingSubmit,
    resetFormHandler,
    submitHandler,
    isSubmitting,
  } = useVerifyEmail({
    newEmail,
    nextSteps,
  })

  return (
    <DialogContent
      className="top-[5%] w-[90%] translate-y-[0] gap-0 rounded-xl px-3 pb-6 pt-14 md:max-w-sm"
      onInteractOutside={e => {
        return e.preventDefault()
      }}
      onCloseAutoFocus={e => {
        if (isSubmitting) return e.preventDefault()
        resetFormHandler()
      }}
    >
      <DialogHeader className="mb-8 dark:text-zinc-100">
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
            Submit
          </Button>
        </form>
      </Form>

      <hr className="my-8 w-full border-zinc-200" />

      <div className="w-full text-left text-sm">
        <p className="mb-2 font-medium dark:text-zinc-100">Didn&apos;t receive email? </p>
        <ol className="list-inside list-disc dark:text-zinc-100">
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
