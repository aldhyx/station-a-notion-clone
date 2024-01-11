import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useLayoutStore } from "@/store/use-layout-store"
import { ChevronsRightIcon, MenuIcon } from "lucide-react"
import React from "react"
import { useMediaQuery } from "usehooks-ts"

export default function ToggleSidebarButton({ onClick }: { onClick: () => void }) {
  const { minimize } = useLayoutStore()
  const isMobile = useMediaQuery("(max-width: 468px)")

  return (
    <Button
      size="icon"
      variant="ghost"
      className={cn(
        "group/collapse relative mr-3 hidden h-7 w-7",
        (minimize || isMobile) && "flex",
      )}
      onClick={onClick}
    >
      <MenuIcon className="absolute h-6 w-6 transition-[opacity] duration-200 group-hover/collapse:opacity-0" />
      <ChevronsRightIcon className="absolute h-6 w-6 opacity-0 transition-[opacity] duration-200 group-hover/collapse:opacity-100" />
    </Button>
  )
}
