import { PASSWORD_REGEX } from "@/constants/regex"
import { z } from "zod"

export const signUpSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Invalid email address" })
    .email({ message: "Invalid email address" })
    .trim()
    .toLowerCase(),
  password: z
    .string()
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

export type SignUpSchema = z.infer<typeof signUpSchema>
