import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { type ResetPasswordSchema, resetPasswordSchema } from "../_schema"
import { useState } from "react"
import { useUserStore } from "@/store/use-user-store"

export const useResetPassword = () => {
  const [isSuccess, setIsSuccess] = useState(false)
  const { updatePasswordAsync } = useUserStore()

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "" },
  })

  const submitHandler = form.handleSubmit(async props => {
    const res = await updatePasswordAsync(props.password)

    if (res?.error) form.setError("root.apiError", { message: res.error })
    else setIsSuccess(true)
  })

  return {
    form,
    errors: form.formState.errors,
    isLoadingSubmit: form.formState.isSubmitting,
    isDisableSubmit: form.formState.isSubmitting,
    submitHandler,
    isSuccess,
  }
}
