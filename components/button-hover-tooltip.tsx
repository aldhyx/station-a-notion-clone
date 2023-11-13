import React from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

export default function ButtonHoverTooltip({
  children,
  text,
  content: Content,
  asChild,
}: {
  children: React.ReactNode
  text?: string
  content?: React.FC
  asChild?: boolean
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
        <TooltipContent className="px-2 py-1  text-xs" side="bottom" align="end">
          {text && text}
          {Content && <Content />}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
