import { supabase } from "@/lib/supabase/client"
import { type PostgrestError } from "@supabase/supabase-js"
import { toast } from "sonner"
import { create } from "zustand"

type UseCreatePage = {
  creating: boolean
  createNewPage: (
    uuid?: string,
  ) => Promise<
    | void
    | { data?: undefined; error: PostgrestError | null }
    | { data: { uuid: string } | null; error?: undefined }
  >
}

export const useCreatePage = create<UseCreatePage>()((set, get) => ({
  creating: false,
  async createNewPage(uuid) {
    if (get().creating) return

    set({ creating: true })

    const toastId = toast(uuid ?? "new-page")
    toast.loading("Creating new page...", { id: toastId })

    const { data, error } = await supabase
      .from("pages")
      .insert({ parent_uuid: uuid })
      .select("uuid")
      .single()

    set({ creating: false })
    if (error) {
      toast.error("Failed to create new page.", { id: toastId })
      return { error }
    }

    toast.success("Successfully created new page.", { id: toastId })

    return { data }
  },
}))
