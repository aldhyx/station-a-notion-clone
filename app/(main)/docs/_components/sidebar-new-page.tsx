import { Button } from "@/components/ui/button"
import { PlusCircleIcon } from "lucide-react"

export default function SidebarNewPage() {
  return (
    <Button
      variant="zinc-ghost"
      className="h-7 justify-start rounded-sm px-3 font-normal text-zinc-600"
    >
      <PlusCircleIcon className="mr-3 h-4 w-4" />
      New Page
    </Button>
  )
}
