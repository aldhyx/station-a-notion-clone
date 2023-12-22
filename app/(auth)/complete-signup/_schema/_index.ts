import { z } from "zod"

export const profileSchema = z.object({
  fullname: z
    .string()
    .min(6, {
      message: "Name must contain at least 6 character(s)",
    })
    .max(72, {
      message: "Name must contain at most 72 character(s)",
    })
    .toLowerCase()
    .trim(),
  username: z
    .string()
    .min(4, {
      message: "Username must contain at least 4 character(s)",
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
