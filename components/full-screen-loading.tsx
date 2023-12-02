import { cn } from "@/lib/utils"
import { LoaderIcon } from "lucide-react"

export default function FullScreenLoading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "fixed left-0 top-0 flex min-h-screen w-full items-center justify-center bg-background",
        className,
      )}
    >
      <LoaderIcon className="h-6 w-6 animate-spin" />
    </div>
  )
}
