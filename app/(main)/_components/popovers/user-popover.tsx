"use client"

import SignOutDialog from "@/components/dialogs/sign-out-dialog"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { LogOutIcon, Settings2Icon, SettingsIcon, UserCircle2 } from "lucide-react"
import { usePathname } from "next/navigation"
import { PropsWithChildren } from "react"
import { useSidebar } from "../../_hooks/use-sidebar"

type Props = PropsWithChildren & {
  fullname: string | null
  username: string | null
}

export default function UserPopover({ children, fullname, username }: Props) {
  const { navigateHandler } = useSidebar()
  const pathname = usePathname()

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
          <section className="border-b border-b-zinc-200 px-3 py-4 dark:border-b-zinc-700">
            <div className="flex gap-x-1 pr-1">
              <div className="relative mr-2 flex h-[40px] w-[40px] items-center justify-center rounded-full bg-zinc-800">
                <span className="text-xl font-medium uppercase text-background">
                  {username ? username[0] : "S"}
                </span>
              </div>

              {(fullname || username) && (
                <div className="flex flex-col">
                  <p className="text-sm capitalize dark:text-zinc-100">
                    {fullname}&apos;s Station
                  </p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300">@{username}</p>
                </div>
              )}
            </div>
          </section>

          <section className="w-full p-1">
            <Button
              variant="ghost"
              className="h-8 w-full justify-start px-3 text-xs font-normal text-zinc-600 dark:text-zinc-300"
              onClick={() => navigateHandler("settings")}
            >
              <Settings2Icon className="mr-3 h-4 w-4" />
              Settings
            </Button>

            <SignOutDialog>
              <Button
                variant="ghost"
                className="h-8 w-full justify-start px-3 text-xs font-normal text-zinc-600 dark:text-zinc-300 "
              >
                <LogOutIcon className="mr-3 h-4 w-4" />
                Log out
              </Button>
            </SignOutDialog>
          </section>
        </div>
      </PopoverContent>
    </Popover>
  )
}
