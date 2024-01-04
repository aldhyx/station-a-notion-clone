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
  PlusCircleIcon,
  StarIcon,
  Trash2Icon,
} from "lucide-react"
import React, { PropsWithChildren, useRef } from "react"
import MoveToTrashDialog from "../dialogs/move-trash-dialog"
import NewDocDialog from "../dialogs/new-doc-dialog"
import RenameDialog from "../dialogs/rename-dialog"
import { type EmitActionStatus } from "@/types"
import { useCopyToClipboard, useMediaQuery } from "usehooks-ts"

export default function SidebarMoreMenuPopover({
  children,
  uuid,
  created_at,
  updated_at,
}: PropsWithChildren & {
  uuid: string
  created_at: string
  updated_at: string
}) {
  const isMobile = useMediaQuery("(max-width: 468px)")
  const [_, copy] = useCopyToClipboard()
  const ref = useRef<HTMLButtonElement | null>(null)

  const emitActionStatusHandler: EmitActionStatus = v => {
    if (v === "success") ref.current?.click()
  }

  const createdAt = created_at
    ? new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(created_at))
    : null
  const updatedAt = updated_at
    ? new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(updated_at))
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
          <section className="border-b border-b-zinc-200 px-1 pb-1 dark:border-b-zinc-700">
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

            <Button
              variant="ghost"
              className="h-8 w-full items-center justify-start px-2 text-xs font-normal"
            >
              <StarIcon className="mr-2 h-4 w-4" />
              Add to favorite
            </Button>

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

            <RenameDialog uuid={uuid} emitActionStatus={emitActionStatusHandler}>
              <Button
                variant="ghost"
                className="h-8 w-full items-center justify-start px-2 text-xs font-normal"
              >
                <FormInputIcon className="mr-2 h-4 w-4" />
                Rename
              </Button>
            </RenameDialog>
          </section>

          <section className="p-3 ">
            <p className="mb-2 flex flex-col text-zinc-500 dark:text-zinc-300">
              <span className="text-[10px]">Created at</span>
              <span className="text-[10px]">{createdAt}</span>
            </p>
            <p className="flex flex-col text-zinc-500 dark:text-zinc-300">
              <span className="text-[10px]">Last edited at</span>
              <span className="text-[10px]">{updatedAt}</span>
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
