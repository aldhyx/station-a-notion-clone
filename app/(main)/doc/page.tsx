"use client"

import { Button } from "@/components/ui/button"
import { useDocStore } from "@/store/use-doc-store"
import { LoaderIcon } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function DocPage() {
  const { createDocAsync, creating } = useDocStore()
  const router = useRouter()

  const createDocHandler = () => {
    createDocAsync({}).then(({ uuid }) => {
      if (uuid) router.push(`/doc/${uuid}`)
    })
  }

  return (
    <div className="flex h-[calc(100vh-48px)] flex-col items-center justify-center">
      <Image
        alt=""
        src="/assets/documents.png"
        width={400}
        height={500}
        className="mb-5 w-[200px] object-contain grayscale md:w-[400px]"
      />
      <p className="mb-5">Create new page to start write your idea.</p>
      <Button onClick={() => createDocHandler()} disabled={creating}>
        {creating && <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />}
        Create New Page
      </Button>
    </div>
  )
}
