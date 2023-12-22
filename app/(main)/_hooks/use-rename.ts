import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRef } from "react"
import { type RenameDocSchema, renameDocSchema } from "../_schema"
import { useSidebarStore } from "@/store/use-sidebar-store"
import { type Emoji } from "@/components/popover/emoji-picker-popover"

export default function useRename({
  uuid,
  title,
  emoji,
}: {
  uuid: string
  title: string | null
  emoji: Emoji | null
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const { renameDocHandler } = useSidebarStore()
  const form = useForm<RenameDocSchema>({
    resolver: zodResolver(renameDocSchema),
    values: { title: title ?? "", emoji: emoji ?? null },
  })

  const submitHandler = form.handleSubmit(({ title, emoji }) => {
    renameDocHandler({ uuid, title, emoji: emoji as Emoji })
    closeButtonRef.current?.click()
  })

  const openDialogHandler = (open: boolean) => {
    if (open) form.reset()
  }

  const { title: formTitle } = form.watch()

  return {
    form,
    errors: form.formState.errors,
    isLoadingSubmit: form.formState.isSubmitting,
    isDisableSubmit: form.formState.isSubmitting || !formTitle,
    submitHandler,
    closeButtonRef,
    openDialogHandler,
  }
}
