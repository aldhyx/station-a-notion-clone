import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Invalid email address",
    })
    .email({ message: "Invalid email address" })
    .toLowerCase()
    .trim(),
  password: z.string().trim(),
})
export type LoginSchema = z.infer<typeof loginSchema>
