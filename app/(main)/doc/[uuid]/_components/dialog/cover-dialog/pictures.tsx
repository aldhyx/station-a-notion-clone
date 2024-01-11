import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useDocStore } from "@/store/use-doc-store"
import { useGalleryStore } from "@/store/use-gallery-store"
import { CheckIcon, ImageOffIcon, TrashIcon } from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"
import DeleteImageDialog from "../delete-image-dialog"

export default function Pictures() {
  const params = useParams()
  const uuid = params.uuid as string
  const { updateDocAsync, doc } = useDocStore()
  const { loadPictures, pictures } = useGalleryStore()

  if (loadPictures && !pictures) return <Pictures.Skeleton />

  if (pictures && pictures.length === 0) return <Pictures.Empty />

  return (
    <section>
      <p className="mb-2 text-sm leading-none">Pictures</p>
      <div className="relative grid grid-cols-4 gap-2">
        {pictures &&
          pictures.map(d => {
            const isSelected = d.path && doc?.image_url && d.path === doc.image_url

            return (
              <div
                role="button"
                key={d.path}
                className="group relative h-auto overflow-hidden rounded-md"
                onClick={() => updateDocAsync(uuid, { image_url: d.path })}
              >
                <div
                  className={cn(
                    "absolute grid h-full w-full place-content-center",
                    isSelected && "bg-zinc-800/50",
                  )}
                >
                  {isSelected && <CheckIcon className=" h-6 w-6 text-zinc-50" />}
                </div>

                <div className="absolute right-0 top-0 group-hover:block md:hidden">
                  <DeleteImageDialog deleteImageHandler={() => {}}>
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

                <Image
                  src={d.signedUrl}
                  className="h-[72px] w-full cursor-pointer rounded-md object-cover object-center hover:opacity-80"
                  alt=""
                  height={72}
                  width={154}
                />
              </div>
            )
          })}
      </div>
    </section>
  )
}

Pictures.Skeleton = function Loading() {
  return (
    <section>
      <p className="mb-2 text-sm leading-none">Pictures</p>
      <div className="grid grid-cols-4 gap-2">
        {Array(2)
          .fill(null)
          .map((_, i) => (
            <Skeleton key={i + 1} className="h-[74px] w-full bg-zinc-200 " />
          ))}
      </div>
    </section>
  )
}

Pictures.Empty = function Empty() {
  return (
    <section>
      <p className="mb-2 text-sm leading-none">Pictures</p>
      <p className="flex w-full justify-center gap-x-2 py-8 text-xs text-zinc-600">
        <ImageOffIcon className="h-4 w-4" />
        <span>Empty</span>
      </p>
    </section>
  )
}
