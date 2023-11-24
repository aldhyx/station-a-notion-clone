import SearchDialog from "@/components/dialogs/search-dialog"
import { Button } from "@/components/ui/button"
import { SearchIcon } from "lucide-react"

export default function SidebarSearch() {
  return (
    <SearchDialog>
      <Button
        variant="ghost"
        className="h-7 justify-start px-3 font-normal text-zinc-600"
      >
        <SearchIcon className="mr-3 h-4 w-4" />
        Search
      </Button>
    </SearchDialog>
  )
}
