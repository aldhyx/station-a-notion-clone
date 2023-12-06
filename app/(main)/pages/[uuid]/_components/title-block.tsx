import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { usePageStore } from "@/hooks/page-store/use-page-store"
import useDebounceCallback from "@/hooks/use-debounce-callback"

export default function TitleBlock() {
  const { loadingPage, page, updateTitle } = usePageStore()
  const { delayedCallback } = useDebounceCallback(1000)

  const loading = loadingPage || !page

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 md:px-1">
        <Skeleton className="mt-4 h-10 w-72 rounded-sm bg-zinc-200" />
      </div>
    )
  }

  const titleChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value ? e.target.value.trim() : undefined
    delayedCallback(() => updateTitle({ title }))
  }

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-0">
      <Input
        type="text"
        defaultValue={page.title || ""}
        className="h-auto border-none bg-background p-0 text-2xl font-bold md:text-3xl"
        onChange={titleChangeHandler}
      />
    </div>
  )
}
