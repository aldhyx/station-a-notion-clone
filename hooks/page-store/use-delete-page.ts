import { supabase } from "@/lib/supabase/client"
import { type PostgrestError } from "@supabase/supabase-js"
import { toast } from "sonner"
import { create } from "zustand"

type UseDeletePage = {
  deletePage: (
    uuid: string,
  ) => Promise<
    | { error: PostgrestError | null; data?: undefined }
    | { error?: undefined; data: { uuid: string } }
  >
}

export const useDeletePage = create<UseDeletePage>()(set => ({
  async deletePage(uuid) {
    const toastId = toast(uuid)

    const { error, data } = await supabase
      .from("pages")
      .update({ is_deleted: true, parent_uuid: null })
      .eq("uuid", uuid)

    if (error) {
      toast.error("Move to trash failed.", { id: toastId })

      return { error }
    }

    toast.success("Moved to trash successfully.", { id: toastId })
    return { data: { uuid } }
  },
}))
