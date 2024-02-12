import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  AppWindowIcon,
  CopyIcon,
  FormInputIcon,
  LockIcon,
  PlusCircleIcon,
  StarIcon,
  Trash2Icon,
} from "lucide-react"
import React, { PropsWithChildren, useRef } from "react"
import MoveToTrashDialog from "@/components/dialog/move-trash-dialog"
import NewDocDialog from "../dialog/new-doc-dialog"
import RenameDialog from "../dialog/rename-dialog"
import { type EmitActionStatus } from "@/types"
import { useCopyToClipboard, useMediaQuery } from "usehooks-ts"
import { timeAgo } from "@/lib/date"

export default function SidebarMoreMenuPopover({
  children,
  uuid,
  created_at,
  updated_at,
  is_locked,
}: PropsWithChildren & {
  uuid: string
  created_at: string
  updated_at: string
  is_locked: boolean | null
}) {
  const isMobile = useMediaQuery("(max-width: 468px)")
  const [_, copy] = useCopyToClipboard()
  const ref = useRef<HTMLButtonElement | null>(null)

  const emitActionStatusHandler: EmitActionStatus = v => {
    if (v === "success") ref.current?.click()
  }

  const createdAt = created_at
    ? timeAgo(created_at as unknown as Date, { withAgo: true })
    : null

  const updatedAt = updated_at
    ? timeAgo(updated_at as unknown as Date, { withAgo: true })
    : null

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="max-w-[200px] overflow-hidden p-0 pt-1"
        align={isMobile ? "end" : "start"}
      >
        <div
          onClick={e => {
            e.stopPropagation()
            return
          }}
        >
          <section className="border-b px-1 pb-1 ">
            <NewDocDialog uuid={uuid} emitActionStatus={emitActionStatusHandler}>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-full items-center justify-start px-2 text-xs font-normal"
              >
                <PlusCircleIcon className="mr-2 h-4 w-4" />
                Add new page
              </Button>
            </NewDocDialog>

            {/* <Button
              variant="ghost"
              className="h-8 w-full items-center justify-start px-2 text-xs font-normal"
            >
              <StarIcon className="mr-2 h-4 w-4" />
              Add to favorite
            </Button> */}

            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-full items-center justify-start px-2 text-xs font-normal"
              onClick={() => {
                ref.current?.click()
                copy(`${window.origin}/doc/${uuid}`)
              }}
            >
              <CopyIcon className="mr-2 h-4 w-4" />
              Copy link
            </Button>

            <MoveToTrashDialog uuid={uuid} emitActionStatus={emitActionStatusHandler}>
              <Button
                variant="ghost"
                className="h-8 w-full items-center justify-start px-2 text-xs font-normal"
                disabled={!!is_locked}
              >
                <Trash2Icon className="mr-2 h-4 w-4" />
                Move to trash
              </Button>
            </MoveToTrashDialog>

            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-full items-center justify-start px-2 text-xs font-normal"
              onClick={() => {
                ref.current?.click()
                window.open(new URL(`/doc/${uuid}`, window.origin))
              }}
            >
              <AppWindowIcon className="mr-2 h-4 w-4" />
              Open in new tab
            </Button>

            {!is_locked && (
              <RenameDialog uuid={uuid} emitActionStatus={emitActionStatusHandler}>
                <Button
                  variant="ghost"
                  className="h-8 w-full items-center justify-start px-2 text-xs font-normal"
                >
                  <FormInputIcon className="mr-2 h-4 w-4" />
                  Rename
                </Button>
              </RenameDialog>
            )}

            {is_locked && (
              <Button
                variant="ghost"
                className="h-8 w-full items-center justify-start px-2 text-xs font-normal"
                disabled
              >
                <FormInputIcon className="mr-2 h-4 w-4" />
                Rename
              </Button>
            )}
          </section>

          {is_locked && (
            <section className="border-b p-3">
              <p className="flex items-center justify-between gap-x-2 text-xs text-sky-800 dark:text-sky-600">
                Page is locked
                <LockIcon size={14} />
              </p>
            </section>
          )}

          <section className="p-3">
            <p className="mb-2 flex flex-col text-muted-foreground">
              <span className="text-[10px]">Created {createdAt}</span>
            </p>
            <p className="flex flex-col text-muted-foreground">
              <span className="text-[10px]">Last updated {updatedAt}</span>
            </p>
          </section>

          <PopoverClose hidden>
            <button ref={ref}>close</button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  )
}
