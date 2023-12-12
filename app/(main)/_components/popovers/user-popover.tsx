"use client"

import SignOutDialog from "@/components/dialogs/sign-out-dialog"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { LogOutIcon, UserCircle2 } from "lucide-react"
import { PropsWithChildren } from "react"

type Props = PropsWithChildren & {
  email: string | null
  fullname: string | null
  username: string | null
}

export default function UserPopover({ children, email, fullname, username }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent
        asChild
        className="overflow-hidden rounded-xl p-0"
        side="bottom"
        align="start"
        alignOffset={8}
      >
        <div className="w-80">
          <section className="border-b border-zinc-200 p-3">
            <span className="mb-3 block text-xs text-zinc-500">{email}</span>
            <div className="flex gap-x-1 px-1">
              <div className="relative mr-2 h-[36px] w-[36px]">
                <UserCircle2 className=" h-[36px] w-[36px]" />
              </div>

              {fullname && username && (
                <div className="flex flex-col">
                  <p className="text-sm capitalize">{fullname}&apos;s Station</p>
                  <p className="text-xs text-zinc-500">@{username}</p>
                </div>
              )}
            </div>
          </section>

          <section className="w-full bg-zinc-100">
            <SignOutDialog>
              <Button
                variant="ghost"
                className="h-9 w-full justify-start rounded-none rounded-b-sm px-3 text-xs font-normal text-zinc-500"
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
