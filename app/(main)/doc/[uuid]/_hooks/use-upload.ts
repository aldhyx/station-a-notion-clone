import { useDropzone } from "react-dropzone"
import { MAX_FILE_SIZE, fileSchema } from "../_schema"
import { useState } from "react"
import { toastError } from "@/lib/toast"
import { useGalleryStore } from "@/store/use-gallery-store"
import { useUserStore } from "@/store/use-user-store"
import { useImagePreview } from "@/hook/use-image-preview"

export default function useUpload() {
  const { uploadImageAsync, getPicturesAsync } = useGalleryStore()
  const { currentUser } = useUserStore()

  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const { preview } = useImagePreview(file)

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    multiple: false,
    maxFiles: 1,
    maxSize: MAX_FILE_SIZE,
    noKeyboard: true,
    disabled: uploading,
    validator(file) {
      if (file instanceof File) {
        const validation = fileSchema.safeParse(file)
        if (!validation.success) throw new Error(validation.error.errors[0].message)
      }
      return null
    },
    onError(err) {
      if (err.message) toastError({ description: err.message })
    },
    onDropAccepted(files, event) {
      uploadImageHandler(files[0])
    },
    onDropRejected() {
      setFile(null)
    },
    onFileDialogCancel() {
      setFile(null)
    },
  })

  const uploadImageHandler = async (file: File) => {
    if (!currentUser?.id) return

    setUploading(true)
    setFile(file)

    try {
      await uploadImageAsync({
        file,
        uuidUser: currentUser.id,
      })
      await getPicturesAsync(currentUser.id)
    } finally {
      setFile(null)
      setUploading(false)
    }
  }

  return {
    preview,
    uploading,
    getInputProps,
    getRootProps,
  }
}
