import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { type ResetPasswordSchema, resetPasswordSchema } from "../_schema"
import { useUserStore } from "@/store/use-user-store"
import { useRef } from "react"

export const useResetPassword = () => {
  const { updatePasswordAsync } = useUserStore()
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "" },
  })

  const submitHandler = form.handleSubmit(async ({ password }) => {
    const res = await updatePasswordAsync(password)

    if (res?.error) form.setError("root.apiError", { message: res.error })
    else closeButtonRef.current?.click()
  })

  const resetFormHandler = () => {
    form.reset()
    form.clearErrors(["password"])
  }

  return {
    form,
    errors: form.formState.errors,
    isLoadingSubmit: form.formState.isSubmitting,
    submitHandler,
    resetFormHandler,
    closeButtonRef,
  }
}
