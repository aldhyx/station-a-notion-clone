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
import { timeAgo } from "@/lib/date"

export default function HeaderMoreMenuPopover({ children }: PropsWithChildren) {
  const [_, copy] = useCopyToClipboard()
  const ref = useRef<HTMLButtonElement | null>(null)
  const { doc } = useDocStore()

  const createdAt = doc
    ? timeAgo(doc.created_at as unknown as Date, { withAgo: true })
    : null

  const updatedAt = doc
    ? timeAgo(doc.updated_at as unknown as Date, { withAgo: true })
    : null

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="max-w-[200px] overflow-hidden p-0 pt-1" align="end">
        <div>
          <section className="border-b px-1 pb-1">
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

            {doc && !doc.is_deleted && (
              <MoveToTrashDialog uuid={doc?.uuid!}>
                <Button
                  variant="ghost"
                  className="h-8 w-full items-center justify-start px-2 text-xs font-normal"
                >
                  <Trash2Icon className="mr-2 h-4 w-4" />
                  Move to trash
                </Button>
              </MoveToTrashDialog>
            )}
          </section>

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
