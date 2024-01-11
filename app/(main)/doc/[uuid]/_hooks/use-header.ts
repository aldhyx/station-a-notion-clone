import { type Emoji } from "@/components/popover/emoji-picker-popover"
import { useDocStore } from "@/store/use-doc-store"
import { useSidebarStore } from "@/store/use-sidebar-store"
import { useParams, useSelectedLayoutSegment } from "next/navigation"
import { useRef } from "react"
import { useUpdateEffect } from "usehooks-ts"

export const useHeader = () => {
  const savingRef = useRef<NodeJS.Timeout | null>(null)
  const { saveStatus, setSaveStatus, loadingDoc, doc } = useDocStore()

  const params = useParams()
  const { sidebarTree } = useSidebarStore()
  const segment = useSelectedLayoutSegment()

  const selectedPage =
    sidebarTree && params.uuid && typeof params.uuid === "string"
      ? sidebarTree.get(params.uuid)
      : null

  const emoji = selectedPage?.emoji ? (selectedPage.emoji as Emoji) : null
  const showLoadingIndicator = loadingDoc || !doc

  useUpdateEffect(() => {
    if (saveStatus === "success") {
      if (!savingRef.current) {
        const id = setTimeout(() => setSaveStatus(null), 1000)
        savingRef.current = id
      } else {
        clearTimeout(savingRef.current)
        const newId = setTimeout(() => setSaveStatus(null), 1000)
        savingRef.current = newId
      }
    }

    return () => {
      if (savingRef.current) clearTimeout(savingRef.current)
    }
  }, [saveStatus])

  return {
    showLoadingIndicator,
    doc,
    emoji,
    title: selectedPage?.title
      ? selectedPage.title
      : segment === "doc"
      ? "Getting started"
      : segment,
    saveStatus,
  }
}
