import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { usePageStore } from "@/hooks/page-store/use-page-store"
import { CheckIcon, ImageIcon, LoaderIcon, TrashIcon } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

type Gallery = { error: string | null; path: string | null; signedUrl: string }

type Props = {
  loading: boolean
  gallery: Gallery[] | null
}

export default function Gallery({ gallery, loading }: Props) {
  const { changeCover, page } = usePageStore()
  // TODO: coba pindah ke use page store
  const [applying, setApplying] = useState<string | null>(null)

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {Array(5)
          .fill(null)
          .map((_, i) => (
            <Skeleton key={i + 1} className="h-[102px] w-full bg-zinc-200" />
          ))}
      </div>
    )
  }

  if (!gallery?.length) {
    return (
      <div className="flex h-40 flex-col items-center justify-center gap-y-3">
        <ImageIcon className="mx-auto h-8 w-8 text-zinc-500" />
        <p className="text-center text-xs text-zinc-500">Empty gallery.</p>
      </div>
    )
  }

  return (
    <div className="relative grid grid-cols-3 gap-2">
      {gallery.map(d => (
        <div
          role="button"
          key={d.path}
          className="group relative h-auto"
          onClick={() => {
            if (d.path?.split("/")[1] === page?.image_url) return

            changeCover({ path: d.path, setApplying })
          }}
        >
          <div className="absolute grid h-full w-full place-content-center bg-zinc-800/50">
            {applying === d.path && (
              <LoaderIcon className=" h-6 w-6 animate-spin text-zinc-50" />
            )}
            {d.path?.split("/")[1] === page?.image_url && (
              <CheckIcon className=" h-6 w-6 text-zinc-50" />
            )}
          </div>

          {applying !== d.path && (
            <div className="absolute right-0 top-0 group-hover:block md:hidden">
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
            </div>
          )}

          <Image
            src={d.signedUrl}
            className="h-[102px] w-full cursor-pointer rounded-sm object-cover object-center hover:opacity-80"
            alt=""
            height={102}
            width={154}
            placeholder={"blur"}
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJoAAABkCAYAAAB+Zyl+AAAAv0lEQVR42u3SMQkAAAgAMO1fUzCGpvAQtgzLqp6AYykaoiEaiIZoiAaiIRqIhmiIBqIhGoiGaIgGoiEaiIZoiAaiIRqIhmiIBqIhGqKBaIgGoiEaooFoiAaiIRqigWiIBqIhGqKBaIgGoiEaooFoiIZoIBqigWiIhmggGqKBaIiGaCAaooFoiIZoIBqigWiIhmggGqIhGoiGaCAaoiEaiIZoIBqiIRqIhmggGqIhGoiGaCAaoiEaiIZoiAai8d8Coa1wbByiGIIAAAAASUVORK5CYII="
          />
        </div>
      ))}
    </div>
  )
}
