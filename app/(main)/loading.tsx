import { Loader } from "lucide-react"

export default function Loading() {
  return (
    <div className="relative grid h-full w-full place-content-center">
      <Loader className="h-6 w-6 animate-spin" />
      {/* <Skeleton className="h-52 w-full rounded-none bg-zinc-200 md:h-64" /> */}
      {/* <Skeleton className="ml-4 mt-4 h-10 w-72 rounded-sm bg-zinc-200 md:ml-16" /> */}
    </div>
  )
}
