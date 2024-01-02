"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-zinc-800 group-[.toaster]:border group-[.toaster]:shadow-sm group-[.toaster]:border-zinc-200 group-[.toaster]:rounded-md group-[.toaster]:p-3 select-none cursor-pointer",
          description: "group-[.toast]:text-zinc-600 group-[.toast]:text-xs",
          title: "group-[.toast]:text-sm",
          error: "group-[.toaster]:text-red-700",
          success: "group-[.toaster]:text-green-700",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
