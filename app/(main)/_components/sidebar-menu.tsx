import { Button } from "@/components/ui/button"
import {
  HomeIcon,
  PlusCircleIcon,
  SearchIcon,
  SettingsIcon,
  Trash2Icon,
} from "lucide-react"
import { useState } from "react"
import { useSidebar } from "../_hooks/use-sidebar"
import SearchDialog from "./search-dialog"

export default function SidebarMenu() {
  const { createNewDocHandler, navigateHandler } = useSidebar()
  const [openSearch, setOpenSearch] = useState(false)

  return (
    <div className="flex flex-col pb-3">
      <SearchDialog setOpen={setOpenSearch} open={openSearch}>
        <Button
          onClick={e => {
            e.stopPropagation()
            setOpenSearch(true)
          }}
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
        onClick={() => navigateHandler("doc")}
      >
        <HomeIcon className="mr-3 h-4 w-4" />
        Home
      </Button>

      <Button
        variant="ghost"
        className="h-7 justify-start px-3 font-normal text-zinc-600"
        onClick={() => createNewDocHandler()}
      >
        <PlusCircleIcon className="mr-3 h-4 w-4" />
        New Page
      </Button>
    </div>
  )
}
