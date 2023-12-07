import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { signUpSchema, type SignUpSchema } from "../_schema"
import { useAuthStore } from "@/store/use-auth-store"

export const useSignUp = () => {
  const { setEmail, signUpAsync } = useAuthStore()
  const router = useRouter()

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "" },
  })

  const submitHandler = form.handleSubmit(async props => {
    const res = await signUpAsync(props)

    if (res?.error) form.setError("root.apiError", { message: res.error })
    else {
      setEmail(props.email)
      router.push(`/signup-verify`)
    }
  })

  const { email: formEmail, password: formPassword } = form.watch()

  return {
    form,
    errors: form.formState.errors,
    isLoadingSubmit: form.formState.isSubmitting,
    isDisableSubmit: form.formState.isSubmitting || !formEmail || !formPassword,
    submitHandler,
  }
}
