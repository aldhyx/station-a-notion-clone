"use client"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useUserStore } from "@/store/use-user-store"
import { ChevronsUpDownIcon, UserCircle2Icon } from "lucide-react"
import UserPopover from "./popovers/user-popover"

export default function SidebarUser() {
  const { currentUser, fullname, username } = useUserStore()

  if (!currentUser) return <Skeleton className="mb-1 h-10 w-full bg-zinc-200" />

  return (
    <UserPopover fullname={fullname} username={username}>
      <Button
        variant="ghost"
        size="lg"
        className="flex h-[50px] w-full items-center justify-start px-3 font-normal dark:text-zinc-100 md:h-11"
      >
        <div className="relative mr-2 h-[20px] w-[20px]">
          <UserCircle2Icon className=" h-[20px] w-[20px]" />
        </div>

        <p className="mr-1 max-w-[250px] truncate md:max-w-[120px]">
          {currentUser.email}
        </p>
        <ChevronsUpDownIcon className="h-3 w-3 text-zinc-500" />
      </Button>
    </UserPopover>
  )
}
