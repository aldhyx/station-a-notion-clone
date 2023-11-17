import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"

export default function SidebarSearch() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-7 justify-start px-3 font-normal text-zinc-600"
        >
          <SearchIcon className="mr-3 h-4 w-4" />
          Search
        </Button>
      </DialogTrigger>
      <DialogContent
        hideCloseButton
        className="w-[80%] rounded-3xl bg-zinc-50 p-0 sm:rounded-2xl md:max-w-[648px]"
      >
        <div className="flex items-center border-b border-zinc-200 px-4 py-1">
          <SearchIcon className="h-5 w-5 text-zinc-400" />

          <Input
            type="email"
            placeholder="Search Frialdhy Ketty's Station..."
            className="border-none bg-zinc-50 text-base placeholder:text-zinc-400 focus-visible:ring-transparent"
          />
        </div>
        <div className="flex h-28 items-center justify-center">
          <p className="text-zinc-500">No results</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
