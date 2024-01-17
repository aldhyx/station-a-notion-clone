import { useDocStore } from "@/store/use-doc-store"
import { LockIcon } from "lucide-react"
import React from "react"

export default function Locked() {
  const { isLocked } = useDocStore()
  if (!isLocked) return null

  return (
    <p className="sticky top-0 z-10 flex w-full items-center justify-center gap-x-2 border-y border-y-secondary bg-background/50 p-2 text-xs font-medium text-sky-800 backdrop-blur dark:text-sky-600">
      <LockIcon size={14} />
      Page is locked
    </p>
  )
}
