import SearchDialog from "@/components/dialogs/search-dialog"
import { Button } from "@/components/ui/button"
import { useCreatePage } from "@/hooks/page-store/use-create-page"
import { useLayoutStore } from "@/hooks/use-layout-store"
import { PlusCircleIcon, SearchIcon, SettingsIcon, Trash2Icon } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SidebarMenu() {
  const { triggerManualMinimize } = useLayoutStore()
  const router = useRouter()
  const { createNewPage } = useCreatePage()

  const clickHandler = (path: "settings" | "trash") => {
    triggerManualMinimize(path)
    router.push(`/${path}`)
  }

  const createNewPageHandler = async () => {
    const res = await createNewPage()
    if (res?.data) {
      triggerManualMinimize("page")
      router.push(`/pages/${res.data.uuid}`)
    }
  }

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
        <Trash2Icon className="mr-3 h-4 w-4" />
        Trash
      </Button>

      <Button
        variant="ghost"
        className="h-7 justify-start px-3 font-normal text-zinc-600"
        onClick={createNewPageHandler}
      >
        <PlusCircleIcon className="mr-3 h-4 w-4" />
        New Page
      </Button>
    </div>
  )
}
