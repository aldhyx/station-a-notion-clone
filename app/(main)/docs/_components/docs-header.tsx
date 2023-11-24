import ButtonHoverTooltip from "@/components/tooltips/button-hover-tooltip"
import { Button } from "@/components/ui/button"
import { Share2Icon, StarIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import HeaderMore from "./header-more"

export default function DocsHeader() {
  const pathname = usePathname()

  if (pathname.startsWith("/docs")) {
    return (
      <div className="flex w-full items-center justify-between ">
        <span className="block max-w-[130px] truncate pl-3 text-sm md:max-w-[240px]">
          Getting Started
        </span>

        <div className="flex items-center justify-center">
          <span className="hidden text-sm text-zinc-500 md:block">Edited 1d ago</span>

          <ButtonHoverTooltip text="Share or publish your docs">
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
          </ButtonHoverTooltip>

          <ButtonHoverTooltip text="Add to your favorites" asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <StarIcon className="h-4 w-4" />
            </Button>
          </ButtonHoverTooltip>

          <HeaderMore />
        </div>
      </div>
    )
  }
  return null
}
