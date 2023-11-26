import SearchDialog from "@/components/dialogs/search-dialog"
import { Button } from "@/components/ui/button"
import { useLayoutStore } from "@/hooks/use-layout-store"
import { PlusCircleIcon, SearchIcon, SettingsIcon, TrashIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SidebarItems() {
  const { triggerManualMinimize } = useLayoutStore()
  const router = useRouter()

  const clickHandler = (path: "settings" | "trash") => {
    triggerManualMinimize(path)
    router.push(`/${path}`)
  }

  return (
    <>
      <SearchDialog>
        <Button
          variant="ghost"
          className="h-7 justify-start px-3 font-normal text-zinc-600"
        >
          <SearchIcon className="mr-3 h-4 w-4" />
          Search
        </Button>
      </SearchDialog>

      <Button
        variant="ghost"
        className="h-7 justify-start px-3 font-normal text-zinc-600"
        onClick={() => clickHandler("settings")}
      >
        <SettingsIcon className="mr-3 h-4 w-4" />
        Settings
      </Button>

      <Button
        variant="ghost"
        className="h-7 justify-start px-3 font-normal text-zinc-600"
        onClick={() => clickHandler("trash")}
      >
        <TrashIcon className="mr-3 h-4 w-4" />
        Trash
      </Button>

      <Button
        variant="ghost"
        className="h-7 justify-start px-3 font-normal text-zinc-600"
      >
        <PlusCircleIcon className="mr-3 h-4 w-4" />
        New Page
      </Button>
    </>
  )
}
