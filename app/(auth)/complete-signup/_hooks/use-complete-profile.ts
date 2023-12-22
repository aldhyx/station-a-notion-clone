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

  const { fullname: formFullname, username: formUsername } = form.watch()

  return {
    errors: form.formState.errors,
    isDisableSubmit: form.formState.isSubmitting || !formFullname || !formUsername,
    isLoadingSubmit: form.formState.isSubmitting,
    isSubmitSuccessful: form.formState.isSubmitSuccessful,
    submitHandler,
    form,
  }
}
