import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { type NewDocSchema, newDocSchema } from "../_schema"
import { useRef } from "react"
import { useLayoutStore } from "@/store/use-layout-store"
import { type Emoji } from "@/components/popover/emoji-picker-popover"
import { type EmitActionStatus } from "@/types"
import { useSidebarStore } from "@/store/use-sidebar-store"

type Props = {
  uuid?: string
  emitActionStatus?: EmitActionStatus
}

export default function useNewDoc({ emitActionStatus, uuid }: Props) {
  const { triggerMinimize } = useLayoutStore()
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const { sidebarTreeCollapseHandler, createDocAsync } = useSidebarStore()
  const router = useRouter()
  const form = useForm<NewDocSchema>({
    resolver: zodResolver(newDocSchema),
    defaultValues: {
      title: "Untitled",
      emoji: null,
    },
  })

  const submitHandler = form.handleSubmit(async ({ title, emoji }) => {
    const res = await createDocAsync({ title, uuid: uuid, emoji: emoji as Emoji })
    if (res?.uuid) {
      sidebarTreeCollapseHandler({ uuid: res.uuid, parent_uuid: res.parent_uuid }, "new")
      emitActionStatus?.("success")

      triggerMinimize("doc")
      closeButtonRef.current?.click()
      router.push(`/doc/${res.uuid}`)
    }
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
