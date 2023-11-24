import { cn } from "@/lib/utils"
import { AlertCircleIcon } from "lucide-react"

export default function ErrorBlock({
  message,
  className,
}: {
  message?: string
  className?: string
}) {
  if (!message || typeof message !== "string") return null

  return (
    <p className={cn("flex items-start text-sm leading-none text-red-600", className)}>
      <AlertCircleIcon className="mr-2 h-4 w-4 shrink-0" />
      {message}
    </p>
  )
}
