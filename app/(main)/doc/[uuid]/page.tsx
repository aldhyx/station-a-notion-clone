"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { useDocStore } from "@/store/use-doc-store"
import { useParams } from "next/navigation"
import { useEffectOnce } from "usehooks-ts"
import Action from "./_components/action"
import Cover from "./_components/cover"
import Title from "./_components/title"
import Editor from "./_components/editor"
import Deleted from "./_components/deleted"
import Locked from "./_components/locked"

export default function DocDetailPage() {
  const params = useParams()
  const uuid = params.uuid as string
  const { getDocAsync } = useDocStore()

  useEffectOnce(() => {
    getDocAsync(uuid)
  })

  return (
    <ScrollArea className="h-[calc(100vh-48px)]">
      <Locked />
      <Deleted />

      <Cover />
      <Action />
      <Title />
      <Editor />
    </ScrollArea>
  )
}
