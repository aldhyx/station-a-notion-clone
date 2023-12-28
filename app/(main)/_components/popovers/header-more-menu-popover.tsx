import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useDocStore } from "@/store/use-doc-store"
import { LockIcon, Trash2Icon } from "lucide-react"
import { PropsWithChildren } from "react"
import MoveToTrashDialog from "../dialogs/move-trash-dialog"

export default function HeaderMoreMenuPopover({ children }: PropsWithChildren) {
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
              variant="ghost"
              className="h-8 w-full items-center justify-start px-3 text-xs font-normal"
            >
              <LockIcon className="mr-2 h-4 w-4" />
              Lock
            </Button>
            <MoveToTrashDialog uuid={doc?.uuid!}>
              <Button
                variant="ghost"
                className="h-8 w-full items-center justify-start px-3 text-xs font-normal"
              >
                <Trash2Icon className="mr-2 h-4 w-4" />
                Move to trash
              </Button>
            </MoveToTrashDialog>
          </section>

          <section className="px-4 py-4">
            <p className="mb-2 flex flex-col text-xs text-zinc-500 dark:text-zinc-300">
              <span>Created at</span>
              <span>{createdAt}</span>
            </p>
            <p className="flex flex-col text-xs text-zinc-500 dark:text-zinc-300">
              <span>Last edited at</span>
              <span>{updatedAt}</span>
            </p>
          </section>
        </div>
      </PopoverContent>
    </Popover>
  )
}
