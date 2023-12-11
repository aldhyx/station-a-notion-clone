import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useDocStore } from "@/store/use-doc-store"
import { ImportIcon, LockIcon, Trash2Icon } from "lucide-react"
import { PropsWithChildren, useState } from "react"
import DeletePageDialog from "../dialogs/delete-page-dialog"

export default function MoreMenuPopover({ children }: PropsWithChildren) {
  const { doc } = useDocStore()
  const [open, setOpen] = useState(false)
  const createdAt = doc ? new Date(doc.created_at).toLocaleString() : null

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="overflow-hidden rounded-xl bg-background p-0"
        align="end"
      >
        <div>
          <section className="border-b border-zinc-200">
            <Button
              variant="ghost"
              className="h-9 w-full justify-start rounded-none px-2 text-sm font-normal"
            >
              <LockIcon className="mr-2 h-4 w-4" />
              Lock
            </Button>
            <DeletePageDialog uuid={doc?.uuid!} open={open} setOpen={setOpen}>
              <Button
                variant="ghost"
                className="h-9 w-full justify-start rounded-none px-2 text-sm font-normal"
                onClick={() => {
                  setOpen(true)
                }}
              >
                <Trash2Icon className="mr-2 h-4 w-4" />
                Move to trash
              </Button>
            </DeletePageDialog>
          </section>
          <section className="">
            <Button
              variant="ghost"
              className="h-9 w-full justify-start rounded-none px-2 text-sm font-normal"
            >
              <ImportIcon className="mr-2 h-4 w-4" />
              Import
            </Button>
          </section>

          {createdAt && (
            <section className="border-t border-zinc-200 px-3 py-2">
              <p className="text-xs text-zinc-500">Created at: {createdAt}</p>
            </section>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
