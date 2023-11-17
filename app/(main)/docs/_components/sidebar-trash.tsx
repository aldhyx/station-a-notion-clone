import { Button } from "@/components/ui/button"
import { TrashIcon } from "lucide-react"

export default function SidebarTrash() {
  return (
    <Button variant="ghost" className="h-7 justify-start px-3 font-normal text-zinc-600">
      <TrashIcon className="mr-3 h-4 w-4" />
      Trash
    </Button>
  )
}
