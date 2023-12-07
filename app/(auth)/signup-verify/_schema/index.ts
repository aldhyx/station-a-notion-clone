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
