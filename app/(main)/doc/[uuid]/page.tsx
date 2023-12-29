"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { useDocStore } from "@/store/use-doc-store"
import dynamic from "next/dynamic"
import { useParams } from "next/navigation"
import { useEffectOnce } from "usehooks-ts"
import Action from "./_components/action"
import Cover from "./_components/cover"

export default function DocDetailPage() {
  const params = useParams()
  const uuid = params.uuid as string
  const { getDocAsync, loadingDoc, failedSaveData, doc } = useDocStore()

  useEffectOnce(() => {
    getDocAsync(uuid)
  })

  console.log({ doc, loadingDoc, failedSaveData })
  return (
    <ScrollArea className="h-[calc(100vh-48px)]">
      <Cover />
      <Action />
    </ScrollArea>
  )
}
