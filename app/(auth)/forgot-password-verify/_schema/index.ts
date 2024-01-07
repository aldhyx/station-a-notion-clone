import { z } from "zod"

export const forgotPasswordVerifySchema = z.object({
  code: z
    .string()
    .min(4, {
      message: "Invalid verification code",
    })
    .trim(),
})

export type ForgotPasswordVerifySchema = z.infer<typeof forgotPasswordVerifySchema>

export const emailSchema = z
  .string({
    required_error: "Invalid email address",
  })
  .email({ message: "Invalid email address" })
  .toLowerCase()
  .trim()
