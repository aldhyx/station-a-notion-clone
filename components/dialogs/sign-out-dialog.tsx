"use client"

import { supabase } from "@/lib/supabase/client"
import { type SignOut } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { PropsWithChildren } from "react"
import { toast } from "sonner"
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
  const message = {
    success: {
      local: "Successfully logged out.",
      global: "Successfully logged out all device",
      others: "Successfully logged out other device",
    },
    error: {
      local: "Something went wrong! Failed to log out",
      global: "Something went wrong! Failed to log out all device",
      others: "Something went wrong! Failed to log out other device",
    },
  }

  const title = {
    local: "Are you sure, do you want to log out?",
    global: "Are you sure, do you want to log out from all logged device?",
    others: "Are you sure, do you want to log out from other logged device?",
  }

  const router = useRouter()

  const signOutHandler = () => {
    const promise = supabase.auth.signOut({ scope })

    toast.promise(promise, {
      loading: "Logging out...",
      success: data => {
        if (data.error) return message.error[scope]

        router.replace("/login")
        return message.success[scope]
      },
      error: message.error[scope],
      dismissible: false,
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        className="max-w-sm overflow-hidden rounded-sm bg-zinc-50 p-0"
        hideCloseButton
      >
        <DialogHeader className="p-4">
          <DialogDescription className="leading-1 text-left text-zinc-900">
            {title[scope]}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="w-full flex-row gap-0 border-t border-zinc-200">
          <Button
            type="button"
            size="lg"
            variant="secondary"
            className="flex-1 rounded-bl-xl"
            onClick={signOutHandler}
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
