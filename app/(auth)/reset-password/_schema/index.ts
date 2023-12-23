import { z } from "zod"

export const resetPasswordSchema = z
  .object({
    password: z
      .string({
        required_error: "Invalid password",
      })
      .min(8, {
        message: "Must contain at least 8 character(s)",
      })
      .max(72, {
        message: "Must contain at most 72 character(s)",
      })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+/, {
        message:
          "Password must contain at least one lowercase letter, one uppercase letter, and one digit (0-9).",
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
