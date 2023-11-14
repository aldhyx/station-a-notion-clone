import ButtonHoverTooltip from "@/components/button-hover-tooltip"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ImportIcon, LockIcon, MoreHorizontalIcon, Trash2Icon } from "lucide-react"

export default function HeaderMore() {
  return (
    <Popover>
      <PopoverTrigger>
        <ButtonHoverTooltip text="Delete, lock, duplicate & more..." asChild>
          <Button variant="zinc-ghost" size="icon" className="h-7 w-7">
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </ButtonHoverTooltip>
      </PopoverTrigger>
      <PopoverContent className="rounded-sm p-0" align="end">
        <div>
          <section className="border-b border-zinc-200 p-1">
            <Button
              variant="zinc-ghost"
              className="h-8 w-full justify-start rounded-sm px-2 text-sm font-normal "
            >
              <LockIcon className="mr-2 h-4 w-4" />
              Lock
            </Button>
            <Button
              variant="zinc-ghost"
              className="h-8 w-full justify-start rounded-sm px-2 text-sm font-normal "
            >
              <Trash2Icon className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </section>
          <section className="p-1">
            <Button
              variant="zinc-ghost"
              className="h-8 w-full justify-start rounded-sm px-2 text-sm font-normal "
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
