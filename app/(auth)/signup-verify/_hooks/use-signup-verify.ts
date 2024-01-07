import { useRouter, useSearchParams } from "next/navigation"
import { useCountdown } from "usehooks-ts"
import { type SignUpVerifySchema, signUpVerifySchema } from "../_schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useAuthStore } from "@/store/use-auth-store"

export default function useSignUpVerify() {
  const params = useSearchParams()
  const email = params.get("mailto")
  const { signUpVerifyAsync, resendOtpAsync } = useAuthStore()
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
    const res = await signUpVerifyAsync({
      email: email!,
      token: code,
    })

    if (res?.error) form.setError("root.apiError", { message: res.error })
    else router.replace("/doc")
  })

  const resendHandler = async () => {
    startCountdown()
    const res = await resendOtpAsync({ email: email! })

    if (res?.error) form.setError("root.apiError", { message: res.error })
    else form.setError("root.apiError", { message: undefined })
  }

  return {
    form,
    errors: form.formState.errors,
    isLoadingSubmit: form.formState.isSubmitting,
    submitHandler,
    resendHandler,
    showCountdown,
    count,
    email,
  }
}
