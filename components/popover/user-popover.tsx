"use client"

import SignOutDialog from "@/components/dialogs/sign-out-dialog"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useUserStore } from "@/hooks/use-user-store"
import { LogOutIcon, UserCircle2 } from "lucide-react"
import React from "react"

export default function UserPopover({ children }: { children: React.ReactNode }) {
  const { currentUser } = useUserStore()
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent asChild className="p-0" side="bottom" align="start" alignOffset={8}>
        <div className="w-80">
          <section className="border-b border-zinc-200 p-3">
            <span className="mb-3 block text-xs text-zinc-500">{currentUser?.email}</span>
            <div className="flex gap-x-1 px-1">
              <div className="relative mr-2 h-[36px] w-[36px]">
                <UserCircle2 className=" h-[36px] w-[36px]" />
              </div>

              <div className="flex flex-col">
                <p className="text-sm">unknown&apos;s Station</p>
                <p className="text-xs text-zinc-600">@unknown</p>
              </div>
            </div>
          </section>

          <section className="w-full bg-zinc-100 p-1">
            <SignOutDialog>
              <Button
                variant="ghost"
                className="h-8 w-full justify-start px-2 text-xs font-normal text-zinc-600"
              >
                <LogOutIcon className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </SignOutDialog>
          </section>
        </div>
      </PopoverContent>
    </Popover>
  )
}
