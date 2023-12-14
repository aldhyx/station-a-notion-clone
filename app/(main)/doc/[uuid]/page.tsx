"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { useDocStore } from "@/store/use-doc-store"
import dynamic from "next/dynamic"
import { useParams } from "next/navigation"
import { useEffectOnce } from "usehooks-ts"
import ActionBlock from "./_components/action-block"
import CoverBlock from "./_components/cover-block"
import FailedBlock from "./_components/failed-block"
import TitleBlock from "./_components/title-block"

const EditorBlock = dynamic(() => import("./_components/editor-block"), {
  ssr: false,
})

export default function DocDetailPage() {
  const params = useParams()
  const uuid = params.uuid as string
  const { getDocAsync } = useDocStore()

  useEffectOnce(() => {
    getDocAsync(uuid)
  })

  return (
    <ScrollArea className="h-[calc(100vh-48px)]">
      <FailedBlock />
      <CoverBlock />
      <ActionBlock />
      <TitleBlock />
      <EditorBlock />
    </ScrollArea>
  )
}
