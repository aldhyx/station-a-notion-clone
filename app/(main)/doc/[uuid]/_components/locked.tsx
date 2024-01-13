import { useDocStore } from "@/store/use-doc-store"
import { LockIcon } from "lucide-react"
import React from "react"

export default function Locked() {
  const { isLocked } = useDocStore()
  if (!isLocked) return null

  return (
    <p className="sticky top-0 z-10 flex w-full items-center justify-center gap-x-2 bg-sky-200/50 p-[6px] text-xs text-sky-800 backdrop-blur-md dark:bg-sky-600/30 dark:text-sky-100">
      <LockIcon size={14} />
      Page is locked
    </p>
  )
}
