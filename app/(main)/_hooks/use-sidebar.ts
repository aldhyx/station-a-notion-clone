import { useParams, useRouter } from "next/navigation"
import { useLayoutStore } from "../../../store/use-layout-store"
import { useMap } from "usehooks-ts"
import { useDocStore } from "@/store/use-doc-store"
import { useState } from "react"

export const useSidebar = () => {
  const params = useParams()
  const router = useRouter()
  const { createDocAsync } = useDocStore()
  const { triggerMinimize } = useLayoutStore()
  const [collapsedMap, collapseActions] = useMap<string, string>([])

  const createNewDocHandler = async (uuid?: string) => {
    const res = await createDocAsync(uuid)
    if (res.uuid) {
      triggerMinimize("doc")
      router.push(`/doc/${res.uuid}`)
    }
  }

  const navigateHandler = (path: "settings" | "trash" | "doc") => {
    triggerMinimize(path)
    router.push(`/${path}`)
  }

  const navigateDocHandler = (uuid: string) => {
    triggerMinimize("doc")
    if (params.uuid && params.uuid === uuid) return
    router.push(`/doc/${uuid}`)
  }

  const docCollapseHandler = (e: React.MouseEvent<HTMLSpanElement>, uuid: string) => {
    e.stopPropagation()
    if (collapsedMap.has(uuid)) collapseActions.remove(uuid)
    else collapseActions.set(uuid, uuid)
  }

  return {
    createNewDocHandler,
    navigateHandler,
    navigateDocHandler,
    docCollapseHandler,
    collapsedMap,
  }
}
