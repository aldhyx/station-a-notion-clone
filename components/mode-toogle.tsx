"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span
          role="button"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-600"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only ">Toggle theme</span>
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
