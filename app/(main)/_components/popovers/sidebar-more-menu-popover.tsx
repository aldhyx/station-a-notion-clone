import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  AppWindowIcon,
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

export default function SidebarMoreMenuPopover({
  children,
  uuid,
}: PropsWithChildren & {
  uuid: string
}) {
  const ref = useRef<HTMLButtonElement | null>(null)

  const emitActionStatusHandler: EmitActionStatus = v => {
    if (v === "success") ref.current?.click()
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="max-w-[200px] overflow-hidden p-0 pt-1" align="start">
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
                className="h-8 w-full items-center justify-start px-3 text-xs font-normal"
              >
                <PlusCircleIcon className="mr-2 h-4 w-4" />
                New page
              </Button>
            </NewDocDialog>

            <RenameDialog uuid={uuid} emitActionStatus={emitActionStatusHandler}>
              <Button
                variant="ghost"
                className="h-8 w-full items-center justify-start px-3 text-xs font-normal"
              >
                <FormInputIcon className="mr-2 h-4 w-4" />
                Rename
              </Button>
            </RenameDialog>

            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-full items-center justify-start px-3 text-xs font-normal"
              onClick={() => {
                ref.current?.click()
                window.open(new URL(`/doc/${uuid}`, window.origin))
              }}
            >
              <AppWindowIcon className="mr-2 h-4 w-4" />
              Open in new tab
            </Button>

            <Button
              variant="ghost"
              className="h-8 w-full items-center justify-start px-3 text-xs font-normal"
            >
              <StarIcon className="mr-2 h-4 w-4" />
              Add to favorite
            </Button>

            <MoveToTrashDialog uuid={uuid} emitActionStatus={emitActionStatusHandler}>
              <Button
                variant="ghost"
                className="h-8 w-full items-center justify-start px-3 text-xs font-normal"
              >
                <Trash2Icon className="mr-2 h-4 w-4" />
                Move to trash
              </Button>
            </MoveToTrashDialog>
          </section>

          <PopoverClose hidden>
            <button ref={ref}>close</button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  )
}
