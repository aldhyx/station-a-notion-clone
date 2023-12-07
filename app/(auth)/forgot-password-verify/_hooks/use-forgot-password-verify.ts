import { type ForgotPasswordVerifySchema, forgotPasswordVerifySchema } from "../_schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/use-auth-store"

export default function useForgotPasswordVerify() {
  const { resetPasswordVerifyAsync } = useAuthStore()
  const router = useRouter()

  const form = useForm<ForgotPasswordVerifySchema>({
    resolver: zodResolver(forgotPasswordVerifySchema),
    defaultValues: { code: "" },
  })

  const submitHandler = form.handleSubmit(async ({ code }) => {
    const res = await resetPasswordVerifyAsync(code)

    if (res?.error) form.setError("root.apiError", { message: res.error })
    else router.replace("/reset-password")
  })

  return {
    form,
    errors: form.formState.errors,
    isLoadingSubmit: form.formState.isSubmitting,
    isDisableSubmit: !form.formState.isValid || form.formState.isSubmitting,
    submitHandler,
  }
}
