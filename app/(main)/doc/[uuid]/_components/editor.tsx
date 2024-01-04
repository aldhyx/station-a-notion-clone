import useDebounceCallback from "@/hook/use-debounce-callback"
import { useDocStore } from "@/store/use-doc-store"
import { useParams } from "next/navigation"
import { Editor as EditorJS } from "@/components/editor"
import { type OutputData } from "@editorjs/editorjs"
import { useState } from "react"
import { Json } from "@/lib/supabase/database.types"

export default function Editor() {
  const params = useParams()
  const uuid = params.uuid as string

  const { delayedCallback } = useDebounceCallback(1000)
  const { updateDocAsync, doc, loadingDoc } = useDocStore()
  const [data, setData] = useState<OutputData | undefined>()

  const updateHandler = (output: unknown) =>
    delayedCallback(() => {
      updateDocAsync(uuid, { content: output as Json })
    })

  if (loadingDoc) return null

  const init = doc?.content ? (doc.content as unknown as OutputData) : undefined

  // TODO: make it realtime event
  return (
    <div className="relative mx-auto max-w-3xl px-4 md:px-0">
      <EditorJS
        onChangeHandler={async (api, event) => {
          if (event && !Array.isArray(event)) {
            const isEmpty = event.detail.target.isEmpty
            const isAdded = event.type === "block-added"
            if (isAdded && isEmpty) return

            const output = await api.saver.save()
            updateHandler(output)
          }
        }}
        data={init}
        placeholder="Press tab or click + button to insert commands..."
      />
    </div>
  )
}
