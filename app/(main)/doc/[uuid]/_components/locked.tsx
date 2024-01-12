import { useDocStore } from "@/store/use-doc-store"
import { LockIcon } from "lucide-react"
import React from "react"

export default function Locked() {
  const { isLocked } = useDocStore()
  if (!isLocked) return null

  return (
    <p className="sticky top-0 z-10 flex w-full items-center justify-center gap-x-2 bg-sky-100/60 p-2 text-sm text-sky-800 backdrop-blur-md dark:bg-sky-600/50 dark:text-sky-50">
      <LockIcon size={14} />
      Locked
    </p>
  )
}
