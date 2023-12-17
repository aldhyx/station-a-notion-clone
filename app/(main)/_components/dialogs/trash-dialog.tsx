import { Emoji } from "@/components/popover/emoji-picker-popover"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import useDebounceCallback from "@/hook/use-debounce-callback"
import { useLayoutStore } from "@/store/use-layout-store"
import { useTrashStore } from "@/store/use-trash-store"
import { DialogClose } from "@radix-ui/react-dialog"
import { FileIcon, LoaderIcon, Trash2Icon, Undo2Icon } from "lucide-react"
import { useRouter } from "next/navigation"
import { PropsWithChildren, useRef } from "react"
import DeleteDialog from "./delete-dialog"

export default function TrashDialog({ children }: PropsWithChildren) {
  const router = useRouter()
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const { triggerMinimize } = useLayoutStore()
  const { delayedCallback } = useDebounceCallback(500)
  const {
    getTrashAsync,
    restorePageAsync,
    loading,
    list,
    more,
    nextPageAsync,
    prevKeyword,
  } = useTrashStore()

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) =>
    delayedCallback(() => {
      const value = e.target.value || null
      getTrashAsync(value)
    })

  const restorePageHandler = async (uuid: string) => {
    await restorePageAsync(uuid)
    closeButtonRef.current?.click()
    triggerMinimize("doc")
    router.push(`/doc/${uuid}`)
  }

  const onClickItemHandler = (uuid: string) => {
    closeButtonRef.current?.click()
    triggerMinimize("doc")
    router.push(`/doc/${uuid}`)
  }

  const loadMoreHandler = () => {
    if (loading) return
    nextPageAsync()
  }

  const openDialogHandler = (open: boolean) => {
    if (open) getTrashAsync()
  }

  const hasData = !!list && !!list.length

  return (
    <Dialog onOpenChange={openDialogHandler}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        autoFocus={false}
        onOpenAutoFocus={e => e.preventDefault()}
        hideCloseButton
        className="top-[5%] flex w-[90%] translate-y-[0] flex-col gap-0 overflow-hidden rounded-xl bg-background p-0  md:!max-w-xl"
      >
        <TrashDialog.Title />
        <div className="px-3 pb-3">
          <Input
            type="test"
            placeholder="Type to search page in trash..."
            className="rounded-xl bg-background text-sm placeholder:text-sm placeholder:text-zinc-500 focus-visible:ring-transparent"
            onChange={onChangeHandler}
            autoFocus={false}
          />
        </div>

        <TrashDialog.Loading isShow={loading && !list} />
        <TrashDialog.Empty isShow={!loading && !hasData && !prevKeyword} />
        <TrashDialog.EmptySearchResult
          isShow={!loading && !hasData && !!prevKeyword}
          keyword={prevKeyword}
        />

        <TrashDialog.SearchKeyword
          keyword={prevKeyword}
          isShow={hasData && !!prevKeyword}
        />

        {hasData && (
          <ScrollArea className="w-full">
            <div className="max-h-[340px] w-full">
              {list.map(item => {
                const emoji = item?.emoji ? (item.emoji as Emoji) : null

                return (
                  <div
                    key={item.uuid}
                    role="button"
                    className="relative flex h-9 max-w-full items-center gap-x-2 border-b border-b-zinc-200 px-3  transition hover:bg-zinc-200 dark:border-b-zinc-700  dark:hover:bg-zinc-700"
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
                      <FileIcon className="h-5 w-5 shrink-0 text-zinc-500 dark:text-zinc-400" />
                    )}

                    <span className="truncate whitespace-nowrap pr-3 text-sm text-zinc-800 dark:text-zinc-100">
                      {item.title}
                    </span>

                    <div
                      className="absolute right-0 top-0 flex h-full items-center gap-x-1 pr-3"
                      onClick={e => {
                        e.stopPropagation()
                      }}
                    >
                      <Button
                        className="h-6 w-6 text-zinc-500 hover:bg-zinc-400/30 dark:text-zinc-400 dark:hover:bg-zinc-400/30"
                        variant="ghost"
                        size="icon"
                        onClick={() => restorePageHandler(item.uuid)}
                      >
                        <Undo2Icon className="h-4 w-4" />
                      </Button>
                      <DeleteDialog uuid={item.uuid}>
                        <Button
                          className="h-6 w-6 text-zinc-500 hover:bg-zinc-400/30 dark:text-zinc-400 dark:hover:bg-zinc-400/30"
                          variant="ghost"
                          size="icon"
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </DeleteDialog>
                    </div>
                  </div>
                )
              })}

              <TrashDialog.LoadMore
                loading={loading}
                onClickHandler={loadMoreHandler}
                isShowLoadMoreButton={hasData && more}
              />
            </div>
          </ScrollArea>
        )}

        <DialogClose asChild>
          <Button className="hidden" ref={closeButtonRef}>
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}

TrashDialog.SearchKeyword = function SearchKeyword(props: {
  keyword: string | null
  isShow: boolean
}) {
  if (props.isShow) {
    return (
      <p className="px-3 py-2 text-xs text-zinc-500 dark:text-zinc-300">
        Showing search result for{" "}
        <i className="font-medium text-zinc-800 dark:text-zinc-100">{props.keyword}</i>
      </p>
    )
  }
  return null
}

TrashDialog.Loading = function Loading(props: { isShow: boolean }) {
  if (props.isShow) {
    return (
      <div className="flex h-28 items-center justify-center text-zinc-500 dark:text-zinc-300">
        <LoaderIcon className="h-4 w-4 animate-spin" />
      </div>
    )
  }
  return null
}

TrashDialog.Title = function Title() {
  return (
    <div className="mb-1 flex items-center justify-start p-3 dark:text-zinc-100">
      <Trash2Icon className="mr-2 h-4 w-4" />
      <p className="text-base font-medium leading-none">Trash</p>
    </div>
  )
}

TrashDialog.Empty = function Empty(props: { isShow: boolean }) {
  if (props.isShow) {
    return (
      <div className="flex h-28 items-center justify-center text-zinc-500 dark:text-zinc-300">
        <p className="text-sm">Empty trash</p>
      </div>
    )
  }
  return null
}

TrashDialog.EmptySearchResult = function EmptySearch(props: {
  isShow: boolean
  keyword: string | null
}) {
  if (props.isShow) {
    return (
      <div className="flex h-28 items-center justify-center text-zinc-500 dark:text-zinc-300">
        <p className="text-sm">
          No result found for{" "}
          <span className="inline-block max-w-[100px] truncate align-middle font-medium italic text-zinc-800 dark:text-zinc-100">
            {props.keyword}
          </span>
        </p>
      </div>
    )
  }
  return null
}

TrashDialog.LoadMore = function LoadMore(props: {
  isShowLoadMoreButton: boolean
  loading: boolean
  onClickHandler: (e: React.MouseEvent<HTMLButtonElement>) => void
}) {
  return (
    <>
      {props.isShowLoadMoreButton && (
        <div className="grid place-items-center py-3">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-9 font-normal"
            disabled={props.loading}
            onClick={props.onClickHandler}
          >
            Load more
            {props.loading && <LoaderIcon className="ml-2 h-4 w-4 animate-spin" />}
          </Button>
        </div>
      )}

      {!props.isShowLoadMoreButton && (
        <p className="py-3 text-center align-middle text-xs text-zinc-500 dark:text-zinc-300">
          No more data
        </p>
      )}
    </>
  )
}
