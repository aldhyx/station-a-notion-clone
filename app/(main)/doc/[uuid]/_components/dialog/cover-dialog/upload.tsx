import { Input } from "@/components/ui/input"
import { ImageIcon, LoaderIcon } from "lucide-react"
import Image from "next/image"
import useUpload from "../../../_hooks/use-upload"

export default function Upload() {
  const { getInputProps, getRootProps, preview, uploading } = useUpload()

  return (
    <div
      className="relative grid h-40 place-content-center rounded-md border border-dashed "
      {...getRootProps({})}
    >
      {uploading ? (
        <>
          {preview && (
            <Image
              src={preview}
              alt=""
              className="absolute -z-10 max-h-40 w-full rounded-md object-contain object-center opacity-20"
              height={0}
              width={0}
            />
          )}

          <p className="flex flex-col items-center text-zinc-800 ">
            <LoaderIcon className="mb-1 h-6 w-6 animate-spin" />
            <span className="text-xs">Uploading image...</span>
          </p>
        </>
      ) : (
        <>
          <Input {...getInputProps()} />
          <ImageIcon className="mx-auto mb-3 h-8 w-8 text-zinc-500 " />
          <p className="mt-0 whitespace-nowrap text-center text-xs text-zinc-500 ">
            <span className="mb-1 block">
              Drag & drop or click here to upload cover image.
            </span>
            <span className="text-blue-800 ">*Image size limited to 1MB</span>
          </p>
        </>
      )}
    </div>
  )
}
