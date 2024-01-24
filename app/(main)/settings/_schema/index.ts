import { PASSWORD_REGEX } from "@/constants/regex"
import { z } from "zod"

export const profileSchema = z.object({
  fullname: z
    .string()
    .min(4, {
      message: "Must contain at least 4 character(s)",
    })
    .max(65, {
      message: "Must contain at most 65 character(s)",
    })
    .toLowerCase()
    .trim(),
  username: z
    .string()
    .min(4, {
      message: "Must contain at least 4 character(s)",
    })
    .max(65, {
      message: "Must contain at most 65 character(s)",
    })
    .regex(/^[a-z0-9._]+$/, {
      message: "Must contain only lowercase letter and or number",
    })
    .toLowerCase()
    .trim(),
})

export type ProfileSchema = z.infer<typeof profileSchema>

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

export const otpSchema = z.object({
  code: z
    .string()
    .min(4, {
      message: "Invalid verification code",
    })
    .trim(),
})
export type OTPSchema = z.infer<typeof otpSchema>

export const requestEmailSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Required" })
    .email({ message: "Invalid email address" })
    .toLowerCase()
    .trim(),
})
export type RequestEmailSchema = z.infer<typeof requestEmailSchema>
