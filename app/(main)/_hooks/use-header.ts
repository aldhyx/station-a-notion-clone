import { useDocStore } from "@/store/use-doc-store"
import { useRef } from "react"
import { useUpdateEffect } from "usehooks-ts"

export const useHeader = () => {
  const savingRef = useRef<NodeJS.Timeout | null>(null)
  const { saveStatus, setSaveStatus } = useDocStore()

  useUpdateEffect(() => {
    if (saveStatus === "success") {
      if (!savingRef.current) {
        const id = setTimeout(() => setSaveStatus(null), 250)
        savingRef.current = id
      } else {
        clearTimeout(savingRef.current)
        const newId = setTimeout(() => setSaveStatus(null), 250)
        savingRef.current = newId
      }
    }

    return () => {
      if (savingRef.current) clearTimeout(savingRef.current)
    }
  }, [saveStatus])
}
