import { Button } from "@/components/ui/button"
import { SettingsIcon } from "lucide-react"

export default function SidebarSettings() {
  return (
    <Button variant="ghost" className="h-7 justify-start px-3 font-normal text-zinc-600">
      <SettingsIcon className="mr-3 h-4 w-4" />
      Settings
    </Button>
  )
}
