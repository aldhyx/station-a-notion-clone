import { useRouter } from "next/navigation"
import { type LoginSchema, loginSchema } from "../_schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuthStore } from "@/store/use-auth-store"

export const useLogin = () => {
  const { loginAsync } = useAuthStore()
  const router = useRouter()

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const submitHandler = form.handleSubmit(async props => {
    const res = await loginAsync(props)

    if (res?.isNeedConfirmEmail) router.push(`/signup-verify?mailto=${props.email}`)
    else if (res?.error) form.setError("root.apiError", { message: res.error })
    else router.replace("/doc")
  })


  return {
    form,
    errors: form.formState.errors,
    isLoadingSubmit: form.formState.isSubmitting,
    submitHandler,
  }
}
