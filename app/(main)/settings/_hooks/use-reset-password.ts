import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { type ResetPasswordSchema, resetPasswordSchema } from "../_schema"
import { useUserStore } from "@/store/use-user-store"

export const useResetPassword = () => {
  const { updatePasswordAsync } = useUserStore()
  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "" },
  })

  const submitHandler = form.handleSubmit(async ({ password }) => {
    const res = await updatePasswordAsync(password)

    if (res?.error) form.setError("root.apiError", { message: res.error })
  })

  const { password: formPassword, confirm_password: formConfirmPassword } = form.watch()

  const resetFormHandler = () => {
    form.reset()
    form.clearErrors(["confirm_password", "password"])
  }

  return {
    form,
    errors: form.formState.errors,
    isLoadingSubmit: form.formState.isSubmitting,
    isDisableSubmit: form.formState.isSubmitting || !formConfirmPassword || !formPassword,
    submitHandler,
    resetFormHandler,
    isSubmitSuccessful: form.formState.isSubmitSuccessful,
  }
}
