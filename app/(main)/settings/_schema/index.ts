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

export const resetPasswordSchema = z
  .object({
    password: z
      .string({
        required_error: "Invalid password",
      })
      .min(8, {
        message: "Must contain at least 8 character(s), one lowercase letter, one uppercase letter, and one digit (0-9).",
      })
      .max(72, {
        message: "Must contain at most 72 character(s)",
      })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+/, {
        message:
          "Must contain at least 8 character(s), one lowercase letter, one uppercase letter, and one digit (0-9).",
      })
      .trim(),
    confirm_password: z
      .string({
        required_error: "Invalid confirm password",
      })
      .min(8, {
        message: "Invalid confirm password",
      })
      .max(72, {
        message: "Invalid confirm password",
      })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+/, {
        message: "Invalid confirm password",
      })
      .trim(),
  })
  .superRefine((arg, ctx) => {
    if (arg.password !== arg.confirm_password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirm_password"],
        message: "Password & confirm password does not match!",
      })
    }
    return z.NEVER
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
    .min(1, {message: 'Required'})
    .email({ message: "Invalid email address" })
    .toLowerCase()
    .trim(),
})
export type RequestEmailSchema = z.infer<typeof requestEmailSchema>
