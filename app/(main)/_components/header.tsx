"use client"

import MoreMenuPopover from "@/components/popover/more-menu-popover"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { usePageStore } from "@/hooks/page-store/use-page-store"
import { useLayoutStore } from "@/hooks/use-layout-store"
import { cn } from "@/lib/utils"
import {
  CheckIcon,
  ChevronsRightIcon,
  LoaderIcon,
  MenuIcon,
  MoreHorizontalIcon,
  Share2Icon,
  StarIcon,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { ForwardRefRenderFunction, forwardRef, useRef } from "react"
import { useUpdateEffect } from "usehooks-ts"

type Props = {
  isMobile: boolean
  maximizeHandler: () => void
}

type HeaderProps = ForwardRefRenderFunction<HTMLDivElement, Props> & {
  Skeleton: React.FC
}

const Header: HeaderProps = function Header({ isMobile, maximizeHandler }, ref) {
  const savingRef = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname()

  const { page, saving, loadingPage, setSaving } = usePageStore()
  const { animating, minimize } = useLayoutStore()

  const loading = loadingPage || !page

  useUpdateEffect(() => {
    if (saving) {
      if (!savingRef.current) {
        const tmId = setTimeout(() => setSaving(null), 1000)
        savingRef.current = tmId
      } else {
        clearTimeout(savingRef.current)
        const newTmId = setTimeout(() => setSaving(null), 1000)
        savingRef.current = newTmId
      }
    }

    return () => {
      if (savingRef.current) clearTimeout(savingRef.current)
    }
  }, [saving, setSaving])

  return (
    <div
      ref={ref}
      className={cn(
        "fixed left-60 right-0 top-0 w-[calc(100vw-240px)] bg-background",
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
            {loading && <Header.Skeleton />}

            {!loading && page && (
              <div className="flex items-center gap-x-4">
                <span className="truncatepl-2 block max-w-[130px] text-sm">
                  {page?.title}
                </span>

                {saving === "start" && (
                  <span className="flex items-center gap-x-1 text-xs text-zinc-500">
                    <LoaderIcon className="h-4 w-4 animate-spin" />
                    Saving...
                  </span>
                )}

                {saving === "success" && (
                  <span className="flex items-center gap-x-1 text-xs text-zinc-500">
                    <CheckIcon className="h-4 w-4" />
                    Saved
                  </span>
                )}
              </div>
            )}

            {!loading && page && (
              <div className="flex items-center justify-center">
                <span className="hidden text-sm text-zinc-500 md:block">
                  Edited 1d ago
                </span>

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
            )}
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
}

Header.Skeleton = function HeaderSkeleton() {
  return (
    <>
      <Skeleton className="h-4 w-[130px] bg-zinc-200" />
      <div className="flex items-center justify-center gap-x-3">
        <Skeleton className="hidden h-4 w-[100px] bg-zinc-200 md:block" />
        <Skeleton className="h-5 w-5 bg-zinc-200 md:w-10" />
        <Skeleton className="h-5 w-5 bg-zinc-200" />
        <Skeleton className="h-5 w-5 bg-zinc-200" />
      </div>
    </>
  )
}

export default forwardRef(Header)
