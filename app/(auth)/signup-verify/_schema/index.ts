import { z } from "zod"

export const signUpVerifySchema = z.object({
  code: z
    .string({ required_error: "Invalid verification code" })
    .min(4, {
      message: "Invalid verification code",
    })
    .trim(),
})

export type SignUpVerifySchema = z.infer<typeof signUpVerifySchema>

export const emailSchema = z
  .string({
    required_error: "Invalid email address",
  })
  .email({ message: "Invalid email address" })
  .toLowerCase()
  .trim()
