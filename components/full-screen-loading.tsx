import { LoaderIcon } from "lucide-react"

export default function FullScreenLoading() {
  return (
    <div className="fixed left-0 top-0 flex min-h-screen w-full items-center justify-center bg-zinc-50">
      <LoaderIcon className="h-6 w-6 animate-spin" />
    </div>
  )
}
