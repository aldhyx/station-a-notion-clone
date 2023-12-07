import { client } from "@/lib/supabase/client"
import { type Database } from "@/lib/supabase/database.types"
import { create } from "zustand"

type Pages = Pick<
  Database["public"]["Tables"]["pages"]["Row"],
  "uuid" | "title" | "emoji" | "parent_uuid"
>[]

type SidebarStore = {
  docList: Record<string, Pages | null> | null
  getDocListsAsync: (uuid?: string) => Promise<void>
}

export const useSidebarStore = create<SidebarStore>()((set, get) => ({
  docList: null,
  async getDocListsAsync(uuid) {
    let query = client.from("pages").select("uuid, title, emoji, parent_uuid")

    if (uuid) query = query.eq("parent_uuid", uuid)
    else query = query.is("parent_uuid", null)

    const { data } = await query
      .or("is_deleted.is.null,is_deleted.is.false")
      .order("created_at", { ascending: true })

    const newData = {
      ...get().docList,
      [uuid ?? "root"]: data ? [...data] : null,
    }

    set({ docList: newData })
  },
}))
