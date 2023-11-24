import { z } from "zod"

const _passwordSchema = z
  .string({
    required_error: "Invalid password",
  })
  .min(8, {
    message: "Password must contain at least 8 character(s)",
  })
  .max(72, {
    message: "Password must contain at most 72 character(s)",
  })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+/, {
    message:
      "Password must contain at least one lowercase letter, one uppercase letter, and one digit (0-9).",
  })
  .trim()

const _confirmPasswordSchema = z
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
  .trim()

const _emailSchema = z
  .string({
    required_error: "Invalid email address",
  })
  .email({ message: "Invalid email address" })
  .toLowerCase()
  .trim()

export const otpSchema = z.object({
  code: z
    .string({ required_error: "Invalid verification code" })
    .min(4, {
      message: "Invalid verification code",
    })
    .trim(),
})

export type OTPSchema = z.infer<typeof otpSchema>

export const signUpSchema = z.object({
  email: _emailSchema,
  password: _passwordSchema,
})

export type SignUpSchema = z.infer<typeof signUpSchema>

export const signInSchema = z.object({
  email: _emailSchema,
  password: z.string().trim(),
})

export type SignInSchema = z.infer<typeof signInSchema>

export const resetPasswordSchema = z
  .object({
    password: _passwordSchema,
    confirm_password: _confirmPasswordSchema,
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

export const profileSchema = z.object({
  name: z
    .string()
    .min(6, {
      message: "Name must contain at least 8 character(s)",
    })
    .max(72, {
      message: "Name must contain at most 72 character(s)",
    })
    .toLowerCase()
    .trim(),
  username: z
    .string()
    .min(6, {
      message: "Username must contain at least 8 character(s)",
    })
    .max(72, {
      message: "Username must contain at most 72 character(s)",
    })
    .regex(/^[a-z0-9]+$/, {
      message: "Invalid confirm username",
    })
    .toLowerCase()
    .trim(),
})

export type ProfileSchema = z.infer<typeof profileSchema>

export const emailVerificationSchema = z.object({
  email: _emailSchema,
})

export type EmailVerificationSchema = z.infer<typeof emailVerificationSchema>
