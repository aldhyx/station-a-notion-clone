import { useAuthStore } from "@/store/use-auth-store"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { type ForgotPasswordSchema, forgotPasswordSchema } from "../_schema"

export default function useForgotPassword() {
  const { resetPasswordAsync } = useAuthStore()
  const router = useRouter()
  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const submitHandler = form.handleSubmit(async ({ email }) => {
    const res = await resetPasswordAsync(email)

    if (res?.error) form.setError("root.apiError", { message: res.error })
    else router.replace(`/forgot-password-verify?mailto=${email}`)
  })


  return {
    form,
    errors: form.formState.errors,
    isLoadingSubmit: form.formState.isSubmitting,
    submitHandler,
  }
}
