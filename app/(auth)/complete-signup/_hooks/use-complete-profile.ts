import { useForm } from "react-hook-form"
import { ProfileSchema, profileSchema } from "../_schema/_index"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUserStore } from "@/store/use-user-store"
import { useRouter } from "next/navigation"

export const useCompleteProfile = () => {
  const { updateProfileAsync, fullname, username } = useUserStore()
  const router = useRouter()

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    values: {
      fullname: fullname ?? "",
      username: username ?? "",
    },
  })

  const submitHandler = form.handleSubmit(async ({ fullname, username }) => {
    const res = await updateProfileAsync({ username, fullname })
    if (res?.error) form.setError("root.apiError", { message: res.error })
    else router.replace("/doc")
  })


  return {
    errors: form.formState.errors,
    isLoadingSubmit: form.formState.isSubmitting,
    isSubmitSuccessful: form.formState.isSubmitSuccessful,
    submitHandler,
    form,
  }
}
