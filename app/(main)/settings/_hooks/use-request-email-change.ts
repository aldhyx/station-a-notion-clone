import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { type RequestEmailSchema, requestEmailSchema } from "../_schema"
import { type Dispatch, type SetStateAction } from "react"
import { useUserStore } from "@/store/use-user-store"

export default function useRequestEmailChange({
  nextSteps,
  setNewEmail,
}: {
  nextSteps: () => void
  setNewEmail: Dispatch<SetStateAction<string>>
}) {
  const { updateEmailAsync } = useUserStore()
  const form = useForm<RequestEmailSchema>({
    resolver: zodResolver(requestEmailSchema),
  })

  const resetFormHandler = () => {
    form.reset()
    form.clearErrors("email")
  }

  const submitHandler = form.handleSubmit(async ({ email }) => {
    const res = await updateEmailAsync(email)

    if (res?.error) form.setError("root.apiError", { message: res.error })
    else {
      setNewEmail(email)
      nextSteps()
    }
  })

  return {
    form,
    errors: form.formState.errors,
    resetFormHandler,
    isLoadingSubmit: form.formState.isSubmitting,
    isSubmitting: form.formState.isSubmitting,
    submitHandler,
  }
}
