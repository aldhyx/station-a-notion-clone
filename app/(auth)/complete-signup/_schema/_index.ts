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
