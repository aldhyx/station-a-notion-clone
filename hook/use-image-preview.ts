import { useState } from "react"
import { useUpdateEffect } from "usehooks-ts"

export const useImagePreview = (file: File | null) => {
  const [preview, setPreview] = useState<string | null>(null)

  useUpdateEffect(() => {
    let url: string | null = null

    if (file && file instanceof File) {
      url = URL.createObjectURL(file)
      setPreview(url)
    } else {
      setPreview(null)
    }

    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [file])

  return { preview }
}
