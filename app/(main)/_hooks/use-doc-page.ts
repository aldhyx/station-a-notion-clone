import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { type NewDocSchema, newDocSchema } from "../_schema"
import { useDocStore } from "@/store/use-doc-store"
import { useRef } from "react"
import { useLayoutStore } from "@/store/use-layout-store"

export default function useNewDoc({ uuid }: { uuid?: string }) {
  const { triggerMinimize } = useLayoutStore()
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const { createDocAsync } = useDocStore()
  const router = useRouter()
  const form = useForm<NewDocSchema>({
    resolver: zodResolver(newDocSchema),
    defaultValues: {
      title: "",
    },
  })

  const submitHandler = form.handleSubmit(async ({ title }) => {
    const res = await createDocAsync({ title, uuid })
    if (res?.uuid) {
      triggerMinimize("doc")
      closeButtonRef.current?.click()
      router.push(`/doc/${res.uuid}`)
    }
  })

  const { title: formTitle } = form.watch()

  return {
    form,
    errors: form.formState.errors,
    isLoadingSubmit: form.formState.isSubmitting,
    isDisableSubmit: form.formState.isSubmitting || !formTitle,
    submitHandler,
    closeButtonRef: closeButtonRef,
  }
}
