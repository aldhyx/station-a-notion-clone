import { z } from "zod"

export const newDocSchema = z.object({
  title: z
    .string({
      required_error: "Invalid title",
    })
    .min(3, { message: "Page title must contain at least 3 character(s)" })
    .max(192, { message: "Page title must contain at most 192 character(s)" })
    .trim(),
  emoji: z
    .object({
      id: z.string(),
      keywords: z.array(z.string()),
      name: z.string(),
      native: z.string(),
      shortcodes: z.string(),
      unified: z.string(),
    })
    .nullable(),
})

export type NewDocSchema = z.infer<typeof newDocSchema>

export const renameDocSchema = z.object({
  title: z
    .string({
      required_error: "Invalid title",
    })
    .min(3, { message: "Page title must contain at least 3 character(s)" })
    .max(192, { message: "Page title must contain at most 192 character(s)" })
    .trim(),
  emoji: z
    .object({
      id: z.string(),
      keywords: z.array(z.string()),
      name: z.string(),
      native: z.string(),
      shortcodes: z.string(),
      unified: z.string(),
    })
    .nullable(),
})

export type RenameDocSchema = z.infer<typeof renameDocSchema>
