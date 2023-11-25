"use client"

import { Button } from "@/components/ui/button"
import { useLayoutStore } from "@/hooks/use-layout-store"
import { SettingsIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SidebarSetting() {
  const { triggerManualMinimize } = useLayoutStore()
  const router = useRouter()

  const clickHandler = () => {
    triggerManualMinimize("settings")
    router.push("/settings")
  }

  return (
    <Button
      variant="ghost"
      className="h-7 justify-start px-3 font-normal text-zinc-600"
      onClick={clickHandler}
    >
      <SettingsIcon className="mr-3 h-4 w-4" />
      Settings
    </Button>
  )
}
