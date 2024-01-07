import { cn } from "@/lib/utils"

export default function ErrorBlock({
  message,
  className,
}: {
  message?: string
  className?: string
}) {
  if (!message || typeof message !== "string") return null

  return (
    <p
      className={cn("flex items-start text-xs leading-none text-destructive", className)}
    >
      {message}
    </p>
  )
}
