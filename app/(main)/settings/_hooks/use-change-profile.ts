import { useForm } from "react-hook-form"
import { ProfileSchema, profileSchema } from "../_schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUserStore } from "@/store/use-user-store"

export const useChangeProfile = () => {
  const { updateProfileAsync, fullname, username } = useUserStore()

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
  })

  const resetFormHandler = () => {
    form.reset()
    form.clearErrors(["fullname", "username"])
  }

  const { fullname: formFullname, username: formUsername } = form.watch()

  return {
    errors: form.formState.errors,
    isDisableSubmit: form.formState.isSubmitting || !formFullname || !formUsername,
    isLoadingSubmit: form.formState.isSubmitting,
    isSubmitSuccessful: form.formState.isSubmitSuccessful,
    resetFormHandler,
    submitHandler,
    form,
  }
}
