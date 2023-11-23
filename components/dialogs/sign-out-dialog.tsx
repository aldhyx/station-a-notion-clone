import { supabase } from "@/lib/supabase/client"
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

export default function SignOutDialog({ children }: PropsWithChildren) {
  const router = useRouter()

  const signOutHandler = () => {
    const promise = supabase.auth.signOut({ scope: "global" })

    toast.promise(promise, {
      loading: "Logging out...",
      success: data => {
        if (data.error) return "Something went wrong! Log out failed."

        router.refresh()
        return "Log out success."
      },
      error: "Something went wrong! Log out failed.",
      dismissible: false,
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        className="w-[80%] overflow-hidden rounded-sm bg-zinc-50 p-0 md:max-w-[348px]"
        hideCloseButton
      >
        <DialogHeader className="p-5">
          <DialogDescription className="text-left leading-none text-zinc-900">
            Are you sure, do you want to log out?
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
