"use client"

import { useUserStore } from "@/hook/store/use-user.store"
import { type SignOut } from "@supabase/supabase-js"
import { PropsWithChildren } from "react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog"

export default function SignOutDialog({
  children,
  scope = "local",
}: PropsWithChildren & SignOut) {
  const { signOutAsync } = useUserStore()
  const title = {
    local: "Are you sure, do you want to log out?",
    global: "Are you sure, do you want to log out from all logged device?",
    others: "Are you sure, do you want to log out from other logged device?",
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        className="max-w-sm overflow-hidden rounded-sm bg-background p-0"
        hideCloseButton
      >
        <DialogHeader className="p-4">
          <DialogDescription className="leading-1 text-left text-zinc-800">
            {title[scope]}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="w-full flex-row gap-0 border-t border-zinc-200">
          <Button
            type="button"
            size="lg"
            variant="secondary"
            className="flex-1 rounded-bl-xl"
            onClick={() => signOutAsync(scope)}
          >
            Yes, log out
          </Button>
          <div className="!m-0 box-border h-full w-[1px] border-r border-zinc-200 p-0" />
          <DialogClose asChild className="!m-0">
            <Button
              type="button"
              size="lg"
              className="flex-1 rounded-br-xl"
              variant="secondary"
            >
              No
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
