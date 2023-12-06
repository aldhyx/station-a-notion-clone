import { usePageStore } from "@/hook/page-store/use-page-store"
import { useRef } from "react"
import { useUpdateEffect } from "usehooks-ts"

export const useSaving = () => {
  const savingRef = useRef<NodeJS.Timeout | null>(null)
  const { saving, setSaving } = usePageStore()

  useUpdateEffect(() => {
    if (saving) {
      if (!savingRef.current) {
        const id = setTimeout(() => setSaving(null), 1000)
        savingRef.current = id
      } else {
        clearTimeout(savingRef.current)
        const newId = setTimeout(() => setSaving(null), 1000)
        savingRef.current = newId
      }
    }

    return () => {
      if (savingRef.current) clearTimeout(savingRef.current)
    }
  }, [saving, setSaving])
}
