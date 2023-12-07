"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { useDocStore } from "@/store/use-doc-store"
import { useParams } from "next/navigation"
import { useEffectOnce } from "usehooks-ts"
import ActionBlock from "./_components/action-block"
import CoverBlock from "./_components/cover-block"
import TitleBlock from "./_components/title-block"

export default function DocDetailPage() {
  const params = useParams()
  const uuid = params.uuid as string
  const { getDocAsync } = useDocStore()

  useEffectOnce(() => {
    getDocAsync(uuid)
  })

  console.count("root")

  return (
    <ScrollArea className="h-[calc(100vh-48px)]">
      <CoverBlock />
      <ActionBlock />
      <TitleBlock />
    </ScrollArea>
  )
}
