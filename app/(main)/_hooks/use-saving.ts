import { useDocStore } from "@/store/use-doc-store"
import { useRef } from "react"
import { useUpdateEffect } from "usehooks-ts"

export const useSaving = () => {
  const savingRef = useRef<NodeJS.Timeout | null>(null)
  const { saving, setSavingDoc } = useDocStore()

  useUpdateEffect(() => {
    if (saving.uuid) {
      if (!savingRef.current) {
        const id = setTimeout(() => setSavingDoc({ status: null, uuid: null }), 1000)
        savingRef.current = id
      } else {
        clearTimeout(savingRef.current)
        const newId = setTimeout(() => setSavingDoc({ status: null, uuid: null }), 1000)
        savingRef.current = newId
      }
    }

    return () => {
      if (savingRef.current) clearTimeout(savingRef.current)
    }
  }, [saving])
}
