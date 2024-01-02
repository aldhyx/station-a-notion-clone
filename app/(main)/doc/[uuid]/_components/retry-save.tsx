import { Button } from "@/components/ui/button"
import { useDocStore } from "@/store/use-doc-store"
import { SaveIcon, XCircleIcon } from "lucide-react"
import { useParams } from "next/navigation"

export default function RetrySave() {
  const params = useParams()
  const uuid = params.uuid as string
  const { failedSaveData, updateDocAsync, saveStatus } = useDocStore()

  if (Object.keys(failedSaveData).length === 0 || saveStatus !== "failed") return null

  return (
    <div className="flex items-center gap-x-2 bg-red-100 px-3 py-2">
      <p className="flex items-center gap-x-2 text-sm text-red-800">
        <XCircleIcon className="h-4 w-4" />
        <span>Failed to save changes</span>
      </p>
      <Button
        size="sm"
        className="h-auto border-none p-[6px] text-xs font-normal"
        variant="destructive"
        onClick={() => updateDocAsync(uuid, {})}
      >
        <SaveIcon className="mr-2 h-4 w-4" />
        Retry save
      </Button>
    </div>
  )
}
