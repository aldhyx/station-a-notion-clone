import { z } from "zod"

export const signUpSchema = z.object({
  email: z
    .string({
      required_error: "Invalid email address",
    })
    .email({ message: "Invalid email address" })
    .toLowerCase()
    .trim(),
  password: z
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
    .trim(),
})

export type SignUpSchema = z.infer<typeof signUpSchema>
