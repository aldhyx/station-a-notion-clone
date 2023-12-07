import { z } from "zod"

export const forgotPasswordVerifySchema = z.object({
  code: z
    .string({ required_error: "Invalid verification code" })
    .min(4, {
      message: "Invalid verification code",
    })
    .trim(),
})

export type ForgotPasswordVerifySchema = z.infer<typeof forgotPasswordVerifySchema>
