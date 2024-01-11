"use client"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useUserStore } from "@/store/use-user-store"
import { ChevronsUpDownIcon } from "lucide-react"
import UserPopover from "./popover/user-popover"

export default function SidebarUser() {
  const { fullname, username } = useUserStore()

  return (
    <UserPopover fullname={fullname} username={username}>
      {!fullname ? (
        <Skeleton className="mb-1 h-10 w-full bg-primary/5" />
      ) : (
        <Button
          variant="ghost"
          size="lg"
          className="flex h-[50px] w-full items-center justify-start px-3 font-normal hover:bg-primary/5 md:h-11"
        >
          <div className="relative mr-2 flex h-[25px] w-[25px] items-center justify-center rounded-full bg-secondary-foreground">
            <span className="text-sm font-medium uppercase text-secondary">
              {fullname ? fullname[0] : "S"}
            </span>
          </div>

          <p className="mr-1 max-w-[250px] truncate capitalize md:max-w-[120px]">
            {fullname}
          </p>

          <ChevronsUpDownIcon className="h-3 w-3 text-muted-foreground" />
        </Button>
      )}
    </UserPopover>
  )
}
