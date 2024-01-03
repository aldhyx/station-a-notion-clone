import { Skeleton } from "@/components/ui/skeleton"
import useDebounceCallback from "@/hook/use-debounce-callback"
import { useDocStore } from "@/store/use-doc-store"
import { useParams } from "next/navigation"
import { useEffect, useRef } from "react"
import TextareaAutosize from "react-textarea-autosize"

export default function Title() {
  const params = useParams()
  const uuid = params.uuid as string

  const textRef = useRef<HTMLTextAreaElement | null>(null)
  const { loadingDoc, doc, updateDocAsync } = useDocStore()
  const { delayedCallback } = useDebounceCallback(1000)

  const changeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    delayedCallback(() => {
      const value = e.target.value ? e.target.value.trim() : "Untitled"
      updateDocAsync(uuid, { title: value })
    })

  useEffect(() => {
    if (!textRef.current) return

    const prevTitle = textRef.current.value
    if (prevTitle !== doc?.title) {
      textRef.current.value = doc?.title ?? "Untitled"
    }
  }, [doc])

  const title = doc?.title ?? "untitled"
  const defaultValue = title.toLowerCase() === "untitled" ? "" : title

  if (loadingDoc) return <Title.Skeleton />

  return (
    <div className="relative mx-auto mb-3 max-w-3xl px-4 md:px-0">
      <TextareaAutosize
        ref={textRef}
        className="w-full text-3xl font-bold focus-visible:outline-none"
        placeholder="Untitled"
        defaultValue={defaultValue}
        onChange={changeHandler}
      />
    </div>
  )
}

Title.Skeleton = function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-4 md:px-1">
      <Skeleton className="mt-4 h-10 w-72 rounded-sm bg-zinc-200" />
    </div>
  )
}
