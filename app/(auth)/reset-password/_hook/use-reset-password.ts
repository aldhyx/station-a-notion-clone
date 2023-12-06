import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  type ResetPasswordSchema,
  resetPasswordSchema,
} from "../_schema/reset-password-schema"
import { updatePasswordAsync } from "../_api/reset-password-api"
import { useState } from "react"

export const useResetPassword = () => {
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "" },
  })

  const submitHandler = form.handleSubmit(async props => {
    const { data, error } = await updatePasswordAsync(props.password)

    if (error) {
      form.setError("root.apiError", { message: error.message })
    } else {
      setIsSuccess(true)
    }
  })

  const {
    formState: { isSubmitting, errors },
  } = form

  const { password: formPassword, confirm_password: formConfirmPassword } = form.watch()

  return {
    form,
    errors,
    isLoadingSubmit: isSubmitting,
    isDisableSubmit: isSubmitting || !formConfirmPassword || !formPassword,
    submitHandler,
    isSuccess,
  }
}
