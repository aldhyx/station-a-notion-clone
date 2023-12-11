import { type Emoji } from "@/components/popover/emoji-picker-popover"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import useDebounceCallback from "@/hook/use-debounce-callback"
import { cn } from "@/lib/utils"
import { useLayoutStore } from "@/store/use-layout-store"
import { useSearchStore } from "@/store/use-search-store"
import { FileIcon, LoaderIcon, SearchIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { type Dispatch, type PropsWithChildren, type SetStateAction } from "react"

type Props = PropsWithChildren & {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export default function SearchDialog({ children, open, setOpen }: Props) {
  const router = useRouter()
  const { triggerMinimize } = useLayoutStore()
  const { delayedCallback } = useDebounceCallback(500)
  const { getPagesAsync, loading, list, more, nextPageAsync, prevKeyword } =
    useSearchStore()

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) =>
    delayedCallback(() => {
      const value = e.target.value || null
      if (value) getPagesAsync(value)
    })

  const onClickItemHandler = (uuid: string) => {
    setOpen(false)
    triggerMinimize("doc")
    router.push(`/doc/${uuid}`)
  }

  const firstLoading = loading && !list
  const hasData = list && !!list.length

  return (
    <Dialog open={open}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        onInteractOutside={() => {
          setOpen(false)
        }}
        hideCloseButton
        className="top-[5%] flex w-[90%] translate-y-[0] flex-col gap-0 rounded-xl bg-background p-0 md:!max-w-xl"
      >
        <div
          className={cn(
            "flex items-center border-zinc-200 px-4 py-1",
            (hasData || prevKeyword) && "border-b",
          )}
        >
          <SearchIcon className="h-5 w-5 text-zinc-500" />

          <Input
            type="test"
            placeholder="Type to search page by title..."
            className="border-none bg-background text-sm placeholder:text-sm placeholder:text-zinc-500 focus-visible:ring-transparent"
            onChange={onChangeHandler}
          />
        </div>

        {prevKeyword && hasData && (
          <p className="px-3 py-2 text-xs text-zinc-500">
            Showing search result for{" "}
            <i className="font-medium text-zinc-800">{prevKeyword}</i>
          </p>
        )}

        {firstLoading && (
          <div className="flex h-28 items-center justify-center text-zinc-500">
            <LoaderIcon className="h-4 w-4 animate-spin" />
          </div>
        )}

        {!loading && !hasData && prevKeyword && (
          <div className="flex h-28 items-center justify-center text-zinc-500">
            <p className="text-sm">
              No result found for{" "}
              <span className="inline-block max-w-[100px] truncate align-middle font-medium italic text-zinc-800">
                {prevKeyword}
              </span>
            </p>
          </div>
        )}

        {hasData && (
          <div className="flex w-full flex-col pb-3">
            {list.map(item => {
              const emoji = item?.emoji ? (item.emoji as Emoji) : null

              return (
                <div
                  key={item.uuid}
                  role="button"
                  className="flex h-9 max-w-full items-center gap-x-2 border-b border-b-zinc-200 px-3 text-zinc-800 transition hover:bg-zinc-200"
                  onClick={() => onClickItemHandler(item.uuid)}
                >
                  {emoji?.native ? (
                    <span
                      role="img"
                      aria-label={emoji?.name}
                      className="block w-5 text-sm antialiased"
                    >
                      {emoji.native}
                    </span>
                  ) : (
                    <FileIcon className="h-5 w-5 shrink-0" />
                  )}

                  <span className="truncate whitespace-nowrap pr-3 text-sm">
                    {item.title}
                  </span>
                  {item.is_deleted && (
                    <span className="ml-auto shrink-0 text-xs text-zinc-500">
                      deleted
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {hasData && !more && (
          <p className="pb-5 pt-2 text-center align-middle text-xs text-zinc-500">
            No more data
          </p>
        )}

        {hasData && more && (
          <div className="mx-auto pb-3">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-9 font-normal"
              disabled={loading}
              onClick={() => {
                if (loading) return
                nextPageAsync()
              }}
            >
              Load more
              {loading && <LoaderIcon className="ml-2 h-4 w-4 animate-spin" />}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
