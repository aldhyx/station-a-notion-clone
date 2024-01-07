import { z } from "zod"

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Required'})
    .email({ message: "Invalid email address" })
    .trim(),
  password: z
    .string()
    .min(1, { message: 'Required' }),
})
export type LoginSchema = z.infer<typeof loginSchema>
