"use client"

import { Emoji } from "@/components/popover/emoji-picker-popover"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useDocStore } from "@/store/use-doc-store"
import {
  CheckIcon,
  ChevronsRightIcon,
  FileIcon,
  LoaderIcon,
  MenuIcon,
  MoreHorizontalIcon,
  Share2Icon,
  StarIcon,
} from "lucide-react"
import { useParams, useSelectedLayoutSegment } from "next/navigation"
import { useHeader } from "../_hooks/use-header"
import MoreMenuPopover from "./popovers/more-menu-popover"

const Header = function Header({
  minimize,
  isMobile,
  maximizeHandler,
}: {
  minimize: boolean
  isMobile: boolean
  maximizeHandler: () => void
}) {
  const params = useParams()
  const segment = useSelectedLayoutSegment()
  const { saveStatus, loadingDoc, doc } = useDocStore()

  useHeader()

  const headerTitle = segment === "doc" ? "Getting started" : segment
  const showDocTitle = segment === "doc" && params.uuid

  const showLoadingIndicator = loadingDoc || !doc

  const emoji = doc?.emoji ? (doc.emoji as Emoji) : null
  return (
    <header className="flex h-12 items-center justify-start  px-3">
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

      {showDocTitle && (
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

              <span className="truncatepl-2 block max-w-[130px] text-sm">
                {doc.title}
              </span>

              {saveStatus === "start" && (
                <span className="flex items-center gap-x-1 text-xs text-zinc-500">
                  <LoaderIcon className="h-4 w-4 animate-spin" />
                  Saving...
                </span>
              )}

              {saveStatus === "success" && (
                <span className="flex items-center gap-x-1 text-xs text-zinc-500">
                  <CheckIcon className="h-4 w-4" />
                  Saved
                </span>
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

              <MoreMenuPopover>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              </MoreMenuPopover>
            </div>
          )}
        </div>
      )}

      {!showDocTitle && (
        <div className="flex w-full items-center justify-between ">
          <p className="max-w-[130px] text-sm capitalize md:max-w-[240px]">
            {headerTitle}
          </p>
        </div>
      )}
    </header>
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

export default Header
