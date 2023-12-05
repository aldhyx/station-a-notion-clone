import { Input } from "@/components/ui/input"
import { useImagePreview } from "@/hooks/use-image-preview"
import { useUserStore } from "@/hooks/use-user-store"
import { getApiError } from "@/lib/error/api-error"
import { supabase } from "@/lib/supabase/client"
import { ImageIcon, LoaderIcon } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import { z } from "zod"

type Props = { getImageList: () => void }

const MAX_FILE_SIZE = 1024 * 1000
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png"]

const fileSchema = z
  .custom<File>()
  .refine(file => file.size <= MAX_FILE_SIZE, { message: `Max image size is 1MB.` })
  .refine(
    file => ACCEPTED_FILE_TYPES.includes(file.type),
    "Only .jpg, .jpeg, and .png files are accepted.",
  )

export default function Upload({ getImageList }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const { currentUser } = useUserStore()
  const { preview } = useImagePreview(file)

  const uploadImage = async (file: File) => {
    if (!currentUser?.id) return

    try {
      setUploading(true)

      const ext = file.type.split("/")[1]
      const { data, error } = await supabase.storage
        .from("covers")
        .upload(`/${currentUser.id}/${Date.now()}.${ext}`, file)

      if (error) throw new Error(error.message)

      toast.success("Successfully add image to gallery.")
      getImageList()
    } catch (error) {
      toast.error(getApiError(error))
    } finally {
      setFile(null)
      setUploading(false)
    }
  }

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
      if (err.message) toast.error(err.message)
    },
    onDropAccepted(files, event) {
      setFile(files[0])
      uploadImage(files[0])
    },
    onDropRejected() {
      setFile(null)
    },
    onFileDialogCancel() {
      setFile(null)
    },
  })

  return (
    <div
      className="relative grid h-40 place-content-center rounded-sm border border-dashed"
      {...getRootProps({})}
    >
      {uploading ? (
        <>
          {preview && (
            <Image
              src={preview}
              alt=""
              className="absolute -z-10 max-h-40 w-full rounded-sm object-contain object-center opacity-20"
              height={0}
              width={0}
            />
          )}

          <p className="flex flex-col items-center text-zinc-800">
            <LoaderIcon className="mb-1 h-6 w-6 animate-spin" />
            <span className="text-xs">Uploading image...</span>
          </p>
        </>
      ) : (
        <>
          <Input {...getInputProps()} />
          <ImageIcon className="mx-auto mb-3 h-8 w-8 text-zinc-500" />
          <p className="mt-0 whitespace-nowrap text-center text-xs text-zinc-500">
            <span className="mb-1 block">
              Drag & drop or click here to upload cover image.
            </span>
            <span className="text-blue-800">*Image size limited to 1MB</span>
          </p>
        </>
      )}
    </div>
  )
}
