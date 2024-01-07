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
            "group toast group-[.toaster]:bg-background group-[.toaster]:border group-[.toaster]:shadow-sm group-[.toaster]:border-stone-200 group-[.toaster]:rounded-md group-[.toaster]:p-3 select-none cursor-pointer",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-xs",
          title: "group-[.toast]:text-sm",
          error: "group-[.toaster]:text-destructive",
          success: "group-[.toaster]:text-green-600",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
