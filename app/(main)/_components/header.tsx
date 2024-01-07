"use client"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import {
  CheckCircle2Icon,
  ChevronsRightIcon,
  FileIcon,
  LoaderIcon,
  MenuIcon,
  MoreHorizontalIcon,
  Share2Icon,
  StarIcon,
  XCircleIcon,
} from "lucide-react"
import { useHeader } from "../_hooks/use-header"
import HeaderMoreMenuPopover from "./popovers/header-more-menu-popover"

const Header = function Header({
  minimize,
  isMobile,
  maximizeHandler,
}: {
  minimize: boolean
  isMobile: boolean
  maximizeHandler: () => void
}) {
  const { saveStatus, title, doc, showLoadingIndicator, emoji, isDetailDocPage } =
    useHeader()

  return (
    <header className="flex h-12 items-center justify-start px-3">
      <Button
        size="icon"
        variant="ghost"
        className={cn(
          "group/collapse relative mr-3 hidden h-7 w-7",
          (minimize || isMobile) && "flex",
        )}
        onClick={maximizeHandler}
      >
        <MenuIcon className="absolute h-6 w-6 transition-[opacity] duration-200 group-hover/collapse:opacity-0" />
        <ChevronsRightIcon className="absolute h-6 w-6 opacity-0 transition-[opacity] duration-200 group-hover/collapse:opacity-100" />
      </Button>

      {isDetailDocPage && (
        <div className="flex w-full items-center justify-between">
          {showLoadingIndicator && <Header.Skeleton />}

          {!showLoadingIndicator && doc && (
            <div className="mr-2 flex items-center gap-x-2">
              {emoji?.native ? (
                <span
                  role="img"
                  aria-label={emoji?.name}
                  className="block w-4 text-sm antialiased"
                >
                  {emoji.native}
                </span>
              ) : (
                <FileIcon className="h-4 w-4 shrink-0" />
              )}

              <p className="block max-w-[130px] truncate pl-1 text-sm">{title}</p>

              {saveStatus === "start" && (
                <p className="flex gap-x-1 align-bottom text-xs text-muted-foreground">
                  <LoaderIcon className="inline-block animate-spin" size={14} />
                </p>
              )}

              {saveStatus === "success" && (
                <p className="flex gap-x-1 align-bottom text-xs text-green-600">
                  <CheckCircle2Icon className="inline-block" size={14} />
                </p>
              )}

              {saveStatus === "failed" && (
                <p className="flex gap-x-1 align-bottom text-xs text-destructive">
                  <XCircleIcon className="inline-block" size={14} />
                  <span className="inline-block">Save failed</span>
                </p>
              )}
            </div>
          )}

          {!showLoadingIndicator && doc && (
            <div className="flex items-center justify-center">
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

              <HeaderMoreMenuPopover>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              </HeaderMoreMenuPopover>
            </div>
          )}
        </div>
      )}

      {!isDetailDocPage && (
        <div className="flex w-full items-center justify-between ">
          <p className="max-w-[130px] text-sm capitalize md:max-w-[240px]">{title}</p>
        </div>
      )}
    </header>
  )
}

Header.Skeleton = function HeaderSkeleton() {
  return (
    <>
      <Skeleton className="h-4 w-[130px] bg-primary/5" />
      <div className="flex items-center justify-center gap-x-3">
        <Skeleton className="hidden h-4 w-[100px] bg-primary/5 md:block" />
        <Skeleton className="h-5 w-5 bg-primary/5 md:w-10" />
        <Skeleton className="h-5 w-5 bg-primary/5" />
        <Skeleton className="h-5 w-5 bg-primary/5" />
      </div>
    </>
  )
}

export default Header
