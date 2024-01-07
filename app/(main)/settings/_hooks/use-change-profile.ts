import { useForm } from "react-hook-form"
import { ProfileSchema, profileSchema } from "../_schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUserStore } from "@/store/use-user-store"
import { useRef } from "react"

export const useChangeProfile = () => {
  const { updateProfileAsync, fullname, username } = useUserStore()
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
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
    else closeButtonRef.current?.click()
  })

  const resetFormHandler = () => {
    form.reset()
    form.clearErrors(["fullname", "username"])
  }


  return {
    errors: form.formState.errors,
    isLoadingSubmit: form.formState.isSubmitting,
    resetFormHandler,
    submitHandler,
    form,
    closeButtonRef,
  }
}
