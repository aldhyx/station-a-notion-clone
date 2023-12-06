import { useCreatePage } from "@/hook/page-store/use-create-page"
import { useDeletePage } from "@/hook/page-store/use-delete-page"
import { useRouter } from "next/navigation"
import { useLayoutStore } from "./use-layout-store"

export const useSidebar = () => {
  const router = useRouter()
  const { createNewPageAsync } = useCreatePage()
  const { deletePageAsync } = useDeletePage()
  const { triggerManualMinimize } = useLayoutStore()

  const createNewPageHandler = async (uuid?: string) => {
    const res = await createNewPageAsync(uuid)
    if (res?.data) {
      triggerManualMinimize("page")
      router.push(`/pages/${res.data.uuid}`)
    }
  }

  const deletePageHandler = async (uuid: string) => {
    const res = await deletePageAsync(uuid)
    if (res.data?.uuid) router.push(`/page`)
  }

  const navigateHandler = (path: "settings" | "trash") => {
    triggerManualMinimize(path)
    router.push(`/${path}`)
  }

  const clickPageHandler = (uuid: string) => {
    triggerManualMinimize("page")
    router.push(`/pages/${uuid}`)
  }

  return {
    createNewPageHandler,
    deletePageHandler,
    navigateHandler,
    clickPageHandler,
  }
}
