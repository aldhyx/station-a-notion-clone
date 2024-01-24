import { PASSWORD_REGEX } from "@/constants/regex"
import { z } from "zod"

export const resetPasswordSchema = z.object({
  password: z
    .string({
      required_error: "Invalid password",
    })
    .min(8, {
      message: "Invalid password",
    })
    .max(72, {
      message: "Must contain at most 72 character(s)",
    })
    .regex(PASSWORD_REGEX, {
      message: "Invalid password",
    }),
})

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>
