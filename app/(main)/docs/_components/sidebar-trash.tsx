import { Button } from "@/components/ui/button"
import { useLayoutStore } from "@/hooks/use-layout-store"
import { TrashIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SidebarTrash() {
  const { triggerManualMinimize } = useLayoutStore()
  const router = useRouter()

  const clickHandler = () => {
    triggerManualMinimize("settings")
    router.push("/trash")
  }

  return (
    <Button
      variant="ghost"
      className="h-7 justify-start px-3 font-normal text-zinc-600"
      onClick={clickHandler}
    >
      <TrashIcon className="mr-3 h-4 w-4" />
      Trash
    </Button>
  )
}
