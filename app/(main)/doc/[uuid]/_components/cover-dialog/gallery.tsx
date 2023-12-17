import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useDocStore } from "@/store/use-doc-store"
import { useGalleryStore } from "@/store/use-gallery-store"
import { CheckIcon, ImageIcon, LoaderIcon, TrashIcon } from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useState } from "react"
import DeleteImageDialog from "../delete-image-dialog/delete-image-dialog"

export default function Gallery() {
  const params = useParams()
  const uuid = params.uuid as string
  const [applying, setApplying] = useState<string | null>(null)

  const { doc, updateDocAsync } = useDocStore()
  const { gallery, loading, deleteImageAsync } = useGalleryStore()

  const updateCoverHandler = async (path: string | null) => {
    if (applying) return
    try {
      setApplying(path)
      await updateDocAsync(uuid, { image_url: path ? path.split("/")[1] : null })
    } finally {
      setApplying(null)
    }
  }

  if (loading && !gallery?.length) return <Gallery.Skeleton />
  if (!gallery?.length) return <Gallery.Empty />

  return (
    <div className="relative grid grid-cols-3 gap-3">
      {gallery.map(d => {
        const isApplying = d.path === applying
        const isSelected = d.path?.split("/")[1] === doc?.image_url

        return (
          <div
            role="button"
            key={d.path}
            className="group relative h-auto overflow-hidden rounded-lg"
            onClick={() => updateCoverHandler(d.path)}
          >
            <div
              className={cn(
                "absolute grid h-full w-full place-content-center",
                isApplying && "bg-zinc-800/50",
                isSelected && "bg-zinc-800/50",
              )}
            >
              {isApplying && (
                <LoaderIcon className=" h-6 w-6 animate-spin text-zinc-50" />
              )}
              {!isApplying && isSelected && (
                <CheckIcon className=" h-6 w-6 text-zinc-50" />
              )}
            </div>

            {!isApplying && (
              <div className="absolute right-0 top-0 group-hover:block md:hidden">
                <DeleteImageDialog
                  deleteImageHandler={() => deleteImageAsync({ path: d.path })}
                >
                  <Button
                    variant="secondary"
                    className="h-7 w-7 rounded-none rounded-bl-2xl border-none bg-background shadow-none outline-none"
                    size="icon"
                    onClick={e => {
                      e.stopPropagation()
                    }}
                  >
                    <TrashIcon className="h-3 w-3" />
                  </Button>
                </DeleteImageDialog>
              </div>
            )}

            <Image
              src={d.signedUrl}
              className="h-[102px] w-full cursor-pointer rounded-md object-cover object-center hover:opacity-80"
              alt=""
              height={102}
              width={154}
            />
          </div>
        )
      })}
    </div>
  )
}

Gallery.Skeleton = function Loading() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {Array(5)
        .fill(null)
        .map((_, i) => (
          <Skeleton
            key={i + 1}
            className="h-[102px] w-full bg-zinc-200 dark:bg-zinc-600"
          />
        ))}
    </div>
  )
}

Gallery.Empty = function Empty() {
  return (
    <div className="flex h-40 flex-col items-center justify-center gap-y-3">
      <ImageIcon className="mx-auto h-8 w-8 text-zinc-500 dark:text-zinc-300" />
      <p className="text-center text-xs text-zinc-500 dark:text-zinc-300">
        Empty gallery.
      </p>
    </div>
  )
}
