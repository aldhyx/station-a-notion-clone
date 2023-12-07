import { Loader } from "lucide-react"

export default function Loading() {
  return (
    <div className="relative grid h-full w-full place-content-center">
      <Loader className="h-6 w-6 animate-spin" />
    </div>
  )
}
