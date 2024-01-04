"use client"

import { ComputerIcon, Moon, MoonIcon, Sun, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PropsWithChildren } from "react"

export default function ModeToggle({ children }: PropsWithChildren) {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      <DropdownMenuContent align="end" side="bottom" sideOffset={-26}>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <SunIcon size={14} className="mr-2" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <MoonIcon size={14} className="mr-2" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <ComputerIcon size={14} className="mr-2" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
