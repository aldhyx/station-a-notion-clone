import { type ForgotPasswordVerifySchema, forgotPasswordVerifySchema } from "../_schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuthStore } from "@/store/use-auth-store"

export default function useForgotPasswordVerify() {
  const params = useSearchParams()
  const email = params.get("mailto")

  const { resetPasswordVerifyAsync } = useAuthStore()
  const router = useRouter()

  const form = useForm<ForgotPasswordVerifySchema>({
    resolver: zodResolver(forgotPasswordVerifySchema),
    defaultValues: { code: "" },
  })

  const submitHandler = form.handleSubmit(async ({ code }) => {
    const res = await resetPasswordVerifyAsync(code, email!)

    if (res?.error) form.setError("root.apiError", { message: res.error })
    else router.replace("/reset-password")
  })

  return {
    form,
    errors: form.formState.errors,
    isLoadingSubmit: form.formState.isSubmitting,
    submitHandler,
  }
}
