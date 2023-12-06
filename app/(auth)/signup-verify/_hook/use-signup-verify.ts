import { useRouter } from "next/navigation"
import { useCountdown } from "usehooks-ts"
import {
  type SignUpVerifySchema,
  signUpVerifySchema,
} from "../_schema/signup-verify-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { resendOtpAsync, signUpVerifyAsync } from "../_api/signup-verify-api"
import { useAuthStore } from "@/hook/store/use-auth-store"

export default function useSignUpVerify() {
  const { email } = useAuthStore()
  const router = useRouter()

  const [count, { startCountdown }] = useCountdown({
    countStart: 60,
  })
  const showCountdown = count != 0 && count < 60

  const form = useForm<SignUpVerifySchema>({
    resolver: zodResolver(signUpVerifySchema),
    defaultValues: { code: "" },
  })

  const submitHandler = form.handleSubmit(async ({ code }) => {
    const { data, error } = await signUpVerifyAsync({
      email: email!,
      token: code,
    })

    if (error) form.setError("root.apiError", { message: error.message })
    else {
      router.replace("/page")
    }
  })

  const resendHandler = async () => {
    startCountdown()
    const { data, error } = await resendOtpAsync(email!)

    if (error) form.setError("root.apiError", { message: error.message })
    else form.setError("root.apiError", { message: undefined })
  }

  return {
    form,
    errors: form.formState.errors,
    isLoadingSubmit: form.formState.isSubmitting,
    isDisableSubmit: !form.formState.isValid || form.formState.isSubmitting,
    submitHandler,
    resendHandler,
    showCountdown,
    count,
    email,
  }
}
