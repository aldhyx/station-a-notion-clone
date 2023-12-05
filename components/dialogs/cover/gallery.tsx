import { Skeleton } from "@/components/ui/skeleton"
import { usePageStore } from "@/hooks/page-store/use-page-store"
import { ImageIcon } from "lucide-react"
import Image from "next/image"

type Gallery = { error: string | null; path: string | null; signedUrl: string }

type Props = {
  loading: boolean
  gallery: Gallery[] | null
}

export default function Gallery({ gallery, loading }: Props) {
  const { page, changeCover } = usePageStore()

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
    <div className="grid grid-cols-3 gap-2">
      {gallery.map(d => (
        <div
          role="button"
          key={d.path}
          className="h-auto"
          onClick={() => changeCover({ path: d.path, uuid: page?.uuid })}
        >
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
