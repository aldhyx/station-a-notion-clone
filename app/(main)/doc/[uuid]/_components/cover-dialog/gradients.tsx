import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useDocStore } from "@/store/use-doc-store"
import { useGalleryStore } from "@/store/use-gallery-store"
import { CheckIcon } from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"

export default function Gradients() {
  const params = useParams()
  const uuid = params.uuid as string
  const { updateDocAsync, doc } = useDocStore()
  const { loadGradients, gradients } = useGalleryStore()

  if (loadGradients && !gradients) return <Gradients.Skeleton />

  return (
    <section>
      <p className="mb-2 text-sm leading-none">Gradients</p>
      <div className="relative grid grid-cols-4 gap-2">
        {gradients &&
          gradients.map(d => {
            const isSelected = d.path && doc?.image_url && d.path === doc.image_url

            return (
              <div
                role="button"
                key={d.path}
                className="group relative h-[72px] overflow-hidden rounded-md"
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
    </section>
  )
}

Gradients.Skeleton = function Loading() {
  return (
    <section>
      <p className="mb-2 text-sm leading-none">Gradients</p>
      <div className="grid grid-cols-4 gap-2">
        {Array(4)
          .fill(null)
          .map((_, i) => (
            <Skeleton key={i + 1} className="h-[74px] w-full bg-zinc-200 " />
          ))}
      </div>
    </section>
  )
}
