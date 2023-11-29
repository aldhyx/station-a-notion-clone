"use client"

import MoreMenuPopover from "@/components/popover/more-menu-popover"
import { Button } from "@/components/ui/button"
import { useLayoutStore } from "@/hooks/use-layout-store"
import { cn } from "@/lib/utils"
import {
  ChevronsRightIcon,
  MenuIcon,
  MoreHorizontalIcon,
  Share2Icon,
  StarIcon,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { forwardRef } from "react"

type Props = {
  isMobile: boolean
  maximizeHandler: () => void
}

const Header = forwardRef<HTMLDivElement, Props>(function Header(
  { isMobile, maximizeHandler },
  ref,
) {
  const pathname = usePathname()
  const { animating, minimize } = useLayoutStore()

  return (
    <div
      ref={ref}
      className={cn(
        "fixed left-60 right-0 top-0 w-[calc(100vw-240px)] bg-zinc-50",
        animating && "transition-all duration-200 ease-in-out",
        isMobile && "left-0 w-full",
      )}
    >
      <header className="flex h-12 items-center justify-start border-b border-zinc-200 px-3">
        <Button
          size="icon"
          variant="ghost"
          className={cn(
            "group/collapse relative mr-3 hidden h-7 w-7",
            minimize && "flex",
            isMobile && "flex",
          )}
          onClick={maximizeHandler}
        >
          <MenuIcon className="absolute h-6 w-6 transition-[opacity] duration-200 group-hover/collapse:opacity-0" />
          <ChevronsRightIcon className="absolute h-6 w-6 opacity-0 transition-[opacity] duration-200 group-hover/collapse:opacity-100" />
        </Button>

        {pathname.startsWith("/pages") && (
          <div className="flex w-full items-center justify-between">
            <span className="block max-w-[130px] truncate pl-2 text-sm md:max-w-[240px]">
              Getting Started
            </span>

            <div className="flex items-center justify-center">
              <span className="hidden text-sm text-zinc-500 md:block">Edited 1d ago</span>

              <Button
                variant="ghost"
                size="sm"
                className="ml-2 hidden h-7 text-sm font-normal md:block"
              >
                Share
              </Button>

              <Button variant="ghost" size="icon" className="h-7 w-7 md:hidden">
                <Share2Icon className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="icon" className="h-7 w-7">
                <StarIcon className="h-4 w-4" />
              </Button>

              <MoreMenuPopover>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              </MoreMenuPopover>
            </div>
          </div>
        )}

        {!pathname.startsWith("/pages") && (
          <div className="flex w-full items-center justify-between ">
            <p className="max-w-[130px] text-sm capitalize md:max-w-[240px]">
              {pathname.replaceAll("/", "")}
            </p>
          </div>
        )}
      </header>
    </div>
  )
})

export default Header
