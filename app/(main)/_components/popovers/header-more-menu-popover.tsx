import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useDocStore } from "@/store/use-doc-store"
import { CopyIcon, LockIcon, Trash2Icon } from "lucide-react"
import { PropsWithChildren, useRef } from "react"
import MoveToTrashDialog from "../dialogs/move-trash-dialog"
import { useCopyToClipboard } from "usehooks-ts"

export default function HeaderMoreMenuPopover({ children }: PropsWithChildren) {
  const [_, copy] = useCopyToClipboard()
  const ref = useRef<HTMLButtonElement | null>(null)
  const { doc } = useDocStore()

  const createdAt = doc
    ? new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(doc.created_at))
    : null
  const updatedAt = doc
    ? new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(doc.updated_at))
    : null

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="max-w-[200px] overflow-hidden p-0 pt-1" align="end">
        <div>
          <section className="border-b border-b-zinc-200 px-1 pb-1 dark:border-b-zinc-700">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-full items-center justify-start px-2 text-xs font-normal"
              onClick={() => {
                ref.current?.click()
                copy(`${window.origin}/doc/${doc?.uuid}`)
              }}
            >
              <CopyIcon className="mr-2 h-4 w-4" />
              Copy link
            </Button>

            <Button
              variant="ghost"
              className="h-8 w-full items-center justify-start px-2 text-xs font-normal"
            >
              <LockIcon className="mr-2 h-4 w-4" />
              Lock
            </Button>
            <MoveToTrashDialog uuid={doc?.uuid!}>
              <Button
                variant="ghost"
                className="h-8 w-full items-center justify-start px-2 text-xs font-normal"
              >
                <Trash2Icon className="mr-2 h-4 w-4" />
                Move to trash
              </Button>
            </MoveToTrashDialog>
          </section>

          <section className="p-3">
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
