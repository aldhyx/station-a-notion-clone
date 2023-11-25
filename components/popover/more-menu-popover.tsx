import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ImportIcon, LockIcon, Trash2Icon } from "lucide-react"
import { PropsWithChildren } from "react"

export default function MoreMenuPopover({ children }: PropsWithChildren) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="bg-zinc-50 p-0" align="end">
        <div>
          <section className="border-b border-zinc-200 p-1">
            <Button
              variant="ghost"
              className="h-8 w-full justify-start px-2 text-sm font-normal "
            >
              <LockIcon className="mr-2 h-4 w-4" />
              Lock
            </Button>
            <Button
              variant="ghost"
              className="h-8 w-full justify-start px-2 text-sm font-normal "
            >
              <Trash2Icon className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </section>
          <section className="p-1">
            <Button
              variant="ghost"
              className="h-8 w-full justify-start px-2 text-sm font-normal "
            >
              <ImportIcon className="mr-2 h-4 w-4" />
              Import
            </Button>
          </section>
        </div>
      </PopoverContent>
    </Popover>
  )
}
