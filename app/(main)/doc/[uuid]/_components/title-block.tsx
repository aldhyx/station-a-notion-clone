import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import useDebounceCallback from "@/hook/use-debounce-callback"
import { useDocStore } from "@/store/use-doc-store"
import { useParams } from "next/navigation"

export default function TitleBlock() {
  const params = useParams()
  const uuid = params.uuid as string

  const { delayedCallback } = useDebounceCallback(1000)
  const { loadingDoc, doc, updateTitleAsync } = useDocStore()
  const loading = loadingDoc || !doc

  const titleChangeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const title = e.target.value ? e.target.value.trim() : undefined

    delayedCallback(() => {
      updateTitleAsync({ title, uuid }).then(res => {
        if (res && res.title) e.target.value = res.title
      })
    })
  }

  if (loading) return <TitleBlock.Skeleton />

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-0">
      <Input
        type="text"
        defaultValue={doc?.title ?? ""}
        className="h-auto border-none bg-background p-0 text-2xl font-bold md:text-3xl"
        onChange={titleChangeHandler}
      />
    </div>
  )
}

TitleBlock.Skeleton = function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-4 md:px-1">
      <Skeleton className="mt-4 h-10 w-72 rounded-sm bg-zinc-200" />
    </div>
  )
}
