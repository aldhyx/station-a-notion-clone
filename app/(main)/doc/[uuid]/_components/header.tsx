import { useParams, usePathname, useSelectedLayoutSegment } from "next/navigation"
import React from "react"
import { useHeader } from "../_hooks/use-header"
import { Skeleton } from "@/components/ui/skeleton"
import {
  CheckCircle2Icon,
  FileIcon,
  LoaderIcon,
  MoreHorizontalIcon,
  Share2Icon,
  StarIcon,
  XCircleIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import HeaderMoreMenuPopover from "./popover/header-more-menu-popover"

export default function DocDetailHeader() {
  const path = usePathname()
  const params = useParams()
  const segment = useSelectedLayoutSegment()
  const { saveStatus, title, doc, showLoadingIndicator, emoji } = useHeader()

  if (segment === "doc" && path.startsWith("/doc") && params.uuid) {
    return (
      <div className="flex w-full items-center justify-between">
        {showLoadingIndicator && <DocDetailHeader.Skeleton />}

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

            <p className="block max-w-[100px] truncate pl-1 text-sm md:max-w-[250px]">
              {title}
            </p>

            {saveStatus === "start" && (
              <p className="flex gap-x-1 align-bottom text-xs text-muted-foreground">
                <LoaderIcon className="inline-block animate-spin" size={14} />
                <span className="hidden md:block">Saving</span>
              </p>
            )}

            {saveStatus === "success" && (
              <p className="flex gap-x-1 align-bottom text-xs text-green-600">
                <CheckCircle2Icon className="inline-block" size={14} />
                <span className="hidden md:block">Save success</span>
              </p>
            )}

            {saveStatus === "failed" && (
              <p className="flex gap-x-1 align-bottom text-xs text-destructive">
                <XCircleIcon className="inline-block" size={14} />
                <span className="hidden md:block">Save failed</span>
              </p>
            )}
          </div>
        )}

        {!showLoadingIndicator && doc && (
          <div className="flex items-center justify-center">
            {/* <Button
              variant="ghost"
              size="sm"
              className="hidden h-7 text-sm font-normal md:block"
            >
              Share
            </Button>
            
            <Button variant="ghost" size="icon" className="h-7 w-7 md:hidden">
              <Share2Icon className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon" className="h-7 w-7">
              <StarIcon className="h-4 w-4" />
            </Button> */}

            <HeaderMoreMenuPopover>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </HeaderMoreMenuPopover>
          </div>
        )}
      </div>
    )
  }

  return null
}

DocDetailHeader.Skeleton = function HeaderSkeleton() {
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
