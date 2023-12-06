"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { usePageStore } from "@/hooks/page-store/use-page-store"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import ActionBlock from "./_components/action-block"
import CoverBlock from "./_components/cover-block"
import TitleBlock from "./_components/title-block"

export default function Page() {
  const params = useParams()
  const router = useRouter()
  const uuid = params.uuid as string

  const { getPage } = usePageStore()

  useEffect(() => {
    getPage(uuid).catch(e => {
      router.replace("/pages")
    })
  }, [uuid, getPage, router])

  return (
    <ScrollArea className="h-[calc(100vh-48px)]">
      <CoverBlock />
      <ActionBlock />
      <TitleBlock />
    </ScrollArea>
  )
}
