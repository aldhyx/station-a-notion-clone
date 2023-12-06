import { client } from "@/lib/supabase/client"
import { type PostgrestError } from "@supabase/supabase-js"
import { toast } from "sonner"
import { create } from "zustand"

type UseDeletePage = {
  deletePageAsync: (
    uuid: string,
  ) => Promise<
    { error: PostgrestError | null; data: null } | { error: null; data: { uuid: string } }
  >
}

export const useDeletePage = create<UseDeletePage>()(set => ({
  async deletePageAsync(uuid) {
    const toastId = toast(uuid)

    const { error, data } = await client
      .from("pages")
      .update({ is_deleted: true, parent_uuid: null })
      .eq("uuid", uuid)

    if (error) {
      toast.error("Move to trash failed.", { id: toastId })

      return { error, data: null }
    }

    toast.success("Moved to trash successfully.", { id: toastId })
    return { data: { uuid }, error: null }
  },
}))
