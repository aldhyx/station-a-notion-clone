"use client"

import SignOutDialog from "@/components/dialog/sign-out-dialog"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { LogOutIcon, MessageCircleQuestionIcon, Settings2Icon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { PropsWithChildren, useRef } from "react"
import { useLayoutStore } from "@/store/use-layout-store"
import FeedbackDialog from "../dialog/feedback-dialog"

type Props = PropsWithChildren & {
  fullname: string | null
  username: string | null
}

export default function UserPopover({ children, fullname, username }: Props) {
  const router = useRouter()
  const { triggerMinimize } = useLayoutStore()
  const pathname = usePathname()
  const ref = useRef<HTMLButtonElement | null>(null)

  const navigateHandler = (path: "settings") => {
    triggerMinimize(path)
    ref.current?.click()
    router.push(`/${path}`)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent
        asChild
        className="overflow-hidden p-0"
        side="bottom"
        align={pathname === "/" ? "end" : "start"}
        alignOffset={pathname === "/" ? 0 : 8}
      >
        <div className="w-72">
          <section className="border-b p-3 ">
            <div className="flex gap-x-1 pr-1">
              <div className="relative mr-2 flex h-[40px] w-[40px] items-center justify-center rounded-full bg-secondary-foreground">
                <span className="text-xl font-medium uppercase text-secondary">
                  {fullname ? fullname[0] : "-"}
                </span>
              </div>

              {(fullname || username) && (
                <div className="flex flex-col">
                  <p className="text-sm capitalize ">{fullname}&apos;s Station</p>
                  <p className="text-xs text-muted-foreground">@{username}</p>
                </div>
              )}
            </div>
          </section>

          <section className="w-full p-1">
            <FeedbackDialog>
              <Button
                variant="ghost"
                className="h-8 w-full justify-start px-2 text-xs font-normal"
              >
                <MessageCircleQuestionIcon className="mr-3 h-4 w-4" />
                Give feedback
              </Button>
            </FeedbackDialog>

            <Button
              variant="ghost"
              className="h-8 w-full justify-start px-2 text-xs font-normal"
              onClick={() => navigateHandler("settings")}
            >
              <Settings2Icon className="mr-3 h-4 w-4" />
              Settings
            </Button>

            <SignOutDialog>
              <Button
                variant="ghost"
                className="h-8 w-full justify-start px-2 text-xs font-normal"
              >
                <LogOutIcon className="mr-3 h-4 w-4" />
                Log out
              </Button>
            </SignOutDialog>
          </section>

          <PopoverClose hidden>
            <button ref={ref}>close</button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  )
}
