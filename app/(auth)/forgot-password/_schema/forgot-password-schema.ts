import { z } from "zod"

export const forgotPasswordSchema = z.object({
  email: z
    .string({
      required_error: "Invalid email address",
    })
    .email({ message: "Invalid email address" })
    .toLowerCase()
    .trim(),
})

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>
