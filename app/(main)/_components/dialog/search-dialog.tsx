import { type Emoji } from "@/components/popover/emoji-picker-popover"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import useDebounceCallback from "@/hook/use-debounce-callback"
import { useLayoutStore } from "@/store/use-layout-store"
import { useSearchStore } from "@/store/use-search-store"
import { FileIcon, LoaderIcon, Redo2Icon, SearchIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useRef, type PropsWithChildren } from "react"

type Props = PropsWithChildren

export default function SearchDialog({ children }: Props) {
  const router = useRouter()
  const closeButtonRef = useRef<HTMLButtonElement>(null)
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
    closeButtonRef.current?.click()
    triggerMinimize("doc")
    router.push(`/doc/${uuid}`)
  }

  const loadMoreHandler = () => {
    if (loading) return
    nextPageAsync()
  }

  const hasData = !!list && !!list.length

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="top-[5%] flex w-[90%] translate-y-[0] flex-col gap-0 rounded-xl p-0 md:!max-w-xl">
        <SearchDialog.Title />
        <div className="px-3 pb-3">
          <Input
            type="text"
            placeholder="Type to search page by title..."
            className="rounded-xl"
            onChange={onChangeHandler}
          />
        </div>

        <SearchDialog.Loading isShow={loading && !list} />
        <SearchDialog.EmptySearchResult
          isShow={!loading && !hasData && !!prevKeyword}
          keyword={prevKeyword}
        />
        <SearchDialog.SearchKeyword
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
                    className="group flex h-10 max-w-full items-center gap-x-2 border-b px-3 transition hover:bg-secondary"
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
                      <FileIcon size={16} className="shrink-0 text-muted-foreground" />
                    )}

                    <span className="max-w-[260px] truncate whitespace-nowrap pr-3 text-sm text-primary md:max-w-[460px]">
                      {item.title}
                    </span>

                    <div className="ml-auto hidden group-hover:block">
                      <Redo2Icon className="h-4 w-4 -rotate-180 text-muted-foreground" />
                    </div>
                  </div>
                )
              })}

              <SearchDialog.LoadMore
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

SearchDialog.Title = function Title() {
  return (
    <div className="mb-1 flex items-center justify-start p-3 ">
      <SearchIcon className="mr-2 h-4 w-4" />
      <p className="text-base font-medium leading-none">Search</p>
    </div>
  )
}

SearchDialog.Loading = function Loading(props: { isShow: boolean }) {
  if (props.isShow) {
    return (
      <div className="flex h-28 items-center justify-center text-muted-foreground">
        <LoaderIcon className="h-4 w-4 animate-spin" />
      </div>
    )
  }
  return null
}

SearchDialog.EmptySearchResult = function EmptySearch(props: {
  isShow: boolean
  keyword: string | null
}) {
  if (props.isShow) {
    return (
      <p className="flex h-28  items-center justify-center text-sm text-muted-foreground">
        No result found for{" "}
        <span className="ml-1 max-w-[100px] truncate align-middle font-medium italic text-primary">
          {props.keyword}
        </span>
      </p>
    )
  }
  return null
}

SearchDialog.SearchKeyword = function SearchKeyword(props: {
  keyword: string | null
  isShow: boolean
}) {
  if (props.isShow) {
    return (
      <p className="px-3 py-2 text-xs text-muted-foreground">
        Showing search result for{" "}
        <i className="font-medium text-primary">{props.keyword}</i>
      </p>
    )
  }
  return null
}

SearchDialog.LoadMore = function LoadMore(props: {
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
            variant="outline"
            size="sm"
            className="font-normal"
            disabled={props.loading}
            onClick={props.onClickHandler}
          >
            {props.loading && <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />}
            Load more
          </Button>
        </div>
      )}

      {!props.isShowLoadMoreButton && (
        <p className="py-3 text-center align-middle text-xs text-muted-foreground">
          No more data
        </p>
      )}
    </>
  )
}
