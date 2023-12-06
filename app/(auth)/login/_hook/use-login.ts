import { useRouter } from "next/navigation"
import { type LoginSchema, loginSchema } from "../_schema/login-schema"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signInWithPasswordCredentials } from "../_api/login-api"
import { useAuthStore } from "@/hook/store/use-auth-store"

export const useLogin = () => {
  const { setEmail } = useAuthStore()
  const router = useRouter()

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const submitHandler = form.handleSubmit(async props => {
    const { data, error } = await signInWithPasswordCredentials(props)
    if (!error) {
      router.replace("/pages")
      return
    }

    if (error.isNeedConfirmEmail) {
      setEmail(props.email)
      router.push(`/signup-verify`)
    } else {
      form.setError("root.apiError", { message: error.message })
    }
  })

  const {
    formState: { isSubmitting, errors },
  } = form

  const { email: formEmail, password: formPassword } = form.watch()

  return {
    form,
    errors,
    isLoadingSubmit: isSubmitting,
    isDisableSubmit: isSubmitting || !formEmail || !formPassword,
    submitHandler,
  }
}
