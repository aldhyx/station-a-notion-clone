import { z } from "zod"

export const MAX_FILE_SIZE = 1024 * 1000
export const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png"]

export const fileSchema = z
  .custom<File>()
  .refine(file => file.size <= MAX_FILE_SIZE, { message: `Max image size is 1MB.` })
  .refine(
    file => ACCEPTED_FILE_TYPES.includes(file.type),
    "Only .jpg, .jpeg, and .png files are accepted.",
  )
