import { useAuthStore } from "@/hook/store/use-auth-store"
import {
  type ForgotPasswordVerifySchema,
  forgotPasswordVerifySchema,
} from "../_schema/forgot-password-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { verifyForResetPasswordAsync } from "../_api/forgot-password-verify-api"

export default function useForgotPasswordVerify() {
  const { email } = useAuthStore()
  const router = useRouter()

  const form = useForm<ForgotPasswordVerifySchema>({
    resolver: zodResolver(forgotPasswordVerifySchema),
    defaultValues: { code: "" },
  })

  const submitHandler = form.handleSubmit(async ({ code }) => {
    const { data, error } = await verifyForResetPasswordAsync({
      email: email!,
      token: code,
    })

    if (error) form.setError("root.apiError", { message: error.message })
    else {
      router.replace("/reset-password")
    }
  })

  return {
    form,
    errors: form.formState.errors,
    isLoadingSubmit: form.formState.isSubmitting,
    isDisableSubmit: !form.formState.isValid || form.formState.isSubmitting,
    submitHandler,
    email,
  }
}
