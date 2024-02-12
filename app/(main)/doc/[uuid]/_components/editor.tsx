import useDebounceCallback from "@/hook/use-debounce-callback"
import { useDocStore } from "@/store/use-doc-store"
import { useParams } from "next/navigation"
import { EditorCore } from "@/components/editor/core/editor"
import EditorJS, { type OutputData } from "@editorjs/editorjs"
import { useCallback, useEffect, useRef, useState } from "react"
import { Json } from "@/lib/supabase/database.types"
// @ts-ignore
import Undo from "editorjs-undo"

export default function Editor() {
  const params = useParams()
  const uuid = params.uuid as string
  const editorRef = useRef<EditorJS | null>(null)

  const { delayedCallback } = useDebounceCallback(2000)
  const { updateDocAsync, doc, loadingDoc, isLocked, setUndoRedoInstance } = useDocStore()
  const [data, setData] = useState<OutputData | undefined>()

  const init = doc?.content ? (doc.content as unknown as OutputData) : undefined

  const updateHandler = (output: unknown) =>
    delayedCallback(() => {
      updateDocAsync(uuid, { content: output as Json })
    })

  const readyHandler = useCallback(
    (editor: EditorJS | null) => {
      if (!editor) return

      const config = { debounceTimer: 500 }
      const undo = new Undo({ editor, config })
      if (init) undo.initialize(init)

      editorRef.current = editor
      setUndoRedoInstance(undo)
    },
    [setUndoRedoInstance, init],
  )

  if (loadingDoc) return null

  // TODO: make it realtime event
  return (
    <div className="relative mx-auto max-w-3xl px-4 md:px-0">
      <EditorCore
        onReadyHandler={readyHandler}
        onSaveHandler={data => {
          updateHandler(data)
          // console.log("onSaveHandler", data)
        }}
        onChangeHandler={async (api, event) => {
          // if (event && !Array.isArray(event)) {
          //   const isEmpty = event.detail.target.isEmpty
          //   const isAdded = event.type === "block-added"
          //   if (isAdded && isEmpty) return
          //   const output = await api.saver.save()
          //   updateHandler(output)
          // }
        }}
        data={init}
        placeholder="Press tab or click + button to insert commands..."
        readOnly={isLocked}
      />
    </div>
  )
}
