import { AlertCircleIcon } from "lucide-react"

export default function ErrorBlock({ message }: { message?: string }) {
  if (!message || typeof message !== "string") return null

  return (
    <p className="flex items-start py-3 text-sm leading-normal text-red-600">
      <AlertCircleIcon className="mr-2 h-4 w-4" />
      {message}
    </p>
  )
}
