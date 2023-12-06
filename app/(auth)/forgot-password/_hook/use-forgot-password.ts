import { useAuthStore } from "@/hook/store/use-auth-store"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import {
  type ForgotPasswordSchema,
  forgotPasswordSchema,
} from "../_schema/forgot-password-schema"
import { requestResetPasswordAsync } from "../_api/forgot-password-api"

export default function useForgotPassword() {
  const { setEmail } = useAuthStore()
  const router = useRouter()
  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const submitHandler = form.handleSubmit(async ({ email }) => {
    const { data, error } = await requestResetPasswordAsync(email)

    if (!error) {
      setEmail(email)
      router.replace("/forgot-password-verify")
      return
    }
    form.setError("root.apiError", { message: error.message })
  })

  const {
    formState: { isSubmitting, errors },
  } = form
  const { email: formEmail } = form.watch()

  return {
    form,
    errors,
    isLoadingSubmit: isSubmitting,
    isDisableSubmit: isSubmitting || !formEmail,
    submitHandler,
  }
}
