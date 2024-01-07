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
import { LoaderIcon, MailIcon } from "lucide-react"
import { type Dispatch, type SetStateAction } from "react"
import useRequestEmailChange from "../../_hooks/use-request-email-change"

type Props = {
  nextSteps: () => void
  setNewEmail: Dispatch<SetStateAction<string>>
}

export default function RequestDialogContent({ nextSteps, setNewEmail }: Props) {
  const { errors, form, isLoadingSubmit, isSubmitting, resetFormHandler, submitHandler } =
    useRequestEmailChange({ nextSteps, setNewEmail })

  return (
    <DialogContent
      className="top-[5%] w-[90%] translate-y-[0] gap-0 rounded-xl px-3 pb-6 pt-14 md:max-w-sm"
      onCloseAutoFocus={e => {
        if (isSubmitting) return e.preventDefault()
        resetFormHandler()
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

          <Button size="lg" className="w-full" type="submit" disabled={isLoadingSubmit}>
            {isLoadingSubmit && (
              <LoaderIcon className="animate mr-2 h-4 w-4 animate-spin" />
            )}
            Continue to change email
          </Button>

          <ErrorBlock message={errors.root?.apiError.message} />
        </form>
      </Form>
    </DialogContent>
  )
}
