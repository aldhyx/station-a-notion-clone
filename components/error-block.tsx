import { AlertCircleIcon } from "lucide-react"

export default function ErrorBlock({ message }: { message?: string }) {
  if (!message || typeof message !== "string") return null

  return (
    <p className="mt-4 flex items-start text-sm leading-normal text-red-600">
      <AlertCircleIcon className="mr-2 h-4 w-4" />
      {message}
    </p>
  )
}
