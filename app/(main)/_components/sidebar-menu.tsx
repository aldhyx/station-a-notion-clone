import { Button } from "@/components/ui/button"
import { HomeIcon, PlusCircleIcon, SearchIcon, Trash2Icon } from "lucide-react"
import NewDocDialog from "./dialogs/new-doc-dialog"
import SearchDialog from "./dialogs/search-dialog"
import TrashDialog from "./dialogs/trash-dialog"
import { useRouter } from "next/navigation"
import { useLayoutStore } from "@/store/use-layout-store"

export default function SidebarMenu() {
  const { triggerMinimize } = useLayoutStore()
  const router = useRouter()

  const navigateHandler = (path: "doc") => {
    triggerMinimize(path)
    router.push(`/${path}`)
  }

  return (
    <div className="flex flex-col pb-3">
      <SearchDialog>
        <Button
          onClick={e => {
            e.stopPropagation()
          }}
          variant="ghost"
          className="h-8 justify-start px-3 font-normal text-zinc-600 dark:text-zinc-300"
        >
          <SearchIcon className="mr-3 h-4 w-4" />
          Search
        </Button>
      </SearchDialog>

      <TrashDialog>
        <Button
          variant="ghost"
          className="h-8 justify-start px-3 font-normal text-zinc-600 dark:text-zinc-300"
        >
          <Trash2Icon className="mr-3 h-4 w-4" />
          Trash
        </Button>
      </TrashDialog>

      <Button
        variant="ghost"
        className="h-8 justify-start px-3 font-normal text-zinc-600 dark:text-zinc-300"
        onClick={() => navigateHandler("doc")}
      >
        <HomeIcon className="mr-3 h-4 w-4" />
        Home
      </Button>

      <NewDocDialog>
        <Button
          variant="ghost"
          className="h-8 justify-start px-3 font-normal text-zinc-600 dark:text-zinc-300"
        >
          <PlusCircleIcon className="mr-3 h-4 w-4" />
          New Page
        </Button>
      </NewDocDialog>
    </div>
  )
}
