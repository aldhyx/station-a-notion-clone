import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { type OTPSchema, otpSchema } from "../_schema"
import { useUserStore } from "@/store/use-user-store"

export const useVerifyEmail = ({
  newEmail,
  nextSteps,
}: {
  newEmail: string
  nextSteps: () => void
}) => {
  const { updateEmailVerifyAsync } = useUserStore()
  const form = useForm<OTPSchema>({
    resolver: zodResolver(otpSchema),
    defaultValues: { code: "" },
  })

  const resetFormHandler = () => {
    form.reset()
    form.clearErrors("code")
  }

  const submitHandler = form.handleSubmit(async ({ code }) => {
    const res = await updateEmailVerifyAsync({ token: code, email: newEmail })
    if (res?.error) form.setError("root.apiError", { message: res.error })
    else nextSteps()
  })


  return {
    form,
    resetFormHandler,
    isLoadingSubmit: form.formState.isSubmitting,
    errors: form.formState.errors,
    submitHandler,
    isSubmitting: form.formState.isSubmitting,
  }
}
