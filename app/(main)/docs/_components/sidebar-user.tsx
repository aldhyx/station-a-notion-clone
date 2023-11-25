import UserPopover from "@/components/popover/user-popover"
import { Button } from "@/components/ui/button"
import { ChevronsUpDownIcon, UserCircle2 } from "lucide-react"

export default function SidebarUser() {
  return (
    <UserPopover>
      <Button
        variant="ghost"
        size="lg"
        className="flex w-full items-center justify-start px-3 font-normal"
      >
        <div className="relative mr-2 h-[20px] w-[20px]">
          <UserCircle2 className=" h-[20px] w-[20px]" />
        </div>

        <p className="mr-1 max-w-[250px] truncate md:max-w-[120px]">unknown</p>
        <ChevronsUpDownIcon className="h-4 w-4 text-zinc-500" />
      </Button>
    </UserPopover>
  )
}
