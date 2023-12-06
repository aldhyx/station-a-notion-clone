import SearchDialog from "@/components/dialogs/search-dialog"
import { Button } from "@/components/ui/button"
import { PlusCircleIcon, SearchIcon, SettingsIcon, Trash2Icon } from "lucide-react"
import { useSidebar } from "../_hook/use-sidebar"

export default function SidebarMenu() {
  const { createNewPageHandler, navigateHandler } = useSidebar()

  return (
    <div className="flex flex-col pb-3">
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
        onClick={() => navigateHandler("settings")}
      >
        <SettingsIcon className="mr-3 h-4 w-4" />
        Settings
      </Button>

      <Button
        variant="ghost"
        className="h-7 justify-start px-3 font-normal text-zinc-600"
        onClick={() => navigateHandler("trash")}
      >
        <Trash2Icon className="mr-3 h-4 w-4" />
        Trash
      </Button>

      <Button
        variant="ghost"
        className="h-7 justify-start px-3 font-normal text-zinc-600"
        onClick={() => createNewPageHandler()}
      >
        <PlusCircleIcon className="mr-3 h-4 w-4" />
        New Page
      </Button>
    </div>
  )
}
