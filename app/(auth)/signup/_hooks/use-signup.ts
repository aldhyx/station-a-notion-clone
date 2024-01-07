import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { signUpSchema, type SignUpSchema } from "../_schema"
import { useAuthStore } from "@/store/use-auth-store"

export const useSignUp = () => {
  const { signUpAsync } = useAuthStore()
  const router = useRouter()

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "" },
  })

  const submitHandler = form.handleSubmit(async props => {
    const res = await signUpAsync(props)

    if (res?.error) form.setError("root.apiError", { message: res.error })
    else router.push(`/signup-verify?mailto=${props.email}`)
  })

  return {
    form,
    errors: form.formState.errors,
    isLoadingSubmit: form.formState.isSubmitting,
    submitHandler,
  }
}
