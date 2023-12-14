import { Editor } from "@/components/editor"
import useDebounceCallback from "@/hook/use-debounce-callback"
import { type Json } from "@/lib/supabase/database.types"
import { useDocStore } from "@/store/use-doc-store"
import { OutputData } from "@editorjs/editorjs"
import { useParams } from "next/navigation"
import { useState } from "react"

export default function EditorBlock() {
  const params = useParams()
  const uuid = params.uuid as string

  const { delayedCallback } = useDebounceCallback(1000)
  const { updateDocAsync, doc, loadingDoc } = useDocStore()

  const [data, setData] = useState<OutputData | undefined>()

  const onSaveHandler = (output: unknown) =>
    delayedCallback(() => {
      updateDocAsync(uuid, { content: output as Json })
    })

  if (loadingDoc || !doc) return

  const init = doc?.content ? (doc.content as unknown as OutputData) : undefined

  return (
    <Editor
      holder="editor"
      data={data ?? init}
      onSaveHandler={output => {
        setData(output)
      }}
      onChangeHandler={async (api, event) => {
        if (event && !Array.isArray(event)) {
          const isEmpty = event.detail.target.isEmpty
          const isAdded = event.type === "block-added"
          if (isAdded && isEmpty) return

          const output = await api.saver.save()
          onSaveHandler(output)
        }
      }}
      placeholder={`Press 'tab' or click '+' to use commands...`}
      onReady={() => console.log("ready")}
    >
      <div id="editor" className="mx-auto max-w-3xl px-4 md:px-0" />
    </Editor>
  )
}
