import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"
import { PropsWithChildren } from "react"

export default function SearchDialog({ children }: PropsWithChildren) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        hideCloseButton
        className="top-[5%] max-w-sm translate-y-[0] rounded-sm bg-zinc-50 p-0 md:max-w-xl"
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
