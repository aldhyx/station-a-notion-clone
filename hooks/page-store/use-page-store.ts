import { supabase } from "@/lib/supabase/client"
import { type Database } from "@/lib/supabase/database-types"
import { create } from "zustand"

type Pages = Pick<
  Database["public"]["Tables"]["pages"]["Row"],
  "uuid" | "title" | "emoji" | "parent_uuid"
>[]

type Page = Database["public"]["Tables"]["pages"]["Row"]

type UsePageStore = {
  pages: Record<string, Pages | null> | null
  page: Page | null
  loadingPage: boolean
  getPages: (uuid?: string) => Promise<void>
  getPage: (uuid: string) => Promise<void>
}

export const usePageStore = create<UsePageStore>()((set, get) => ({
  pages: null,
  page: null,
  loadingPage: false,
  async getPages(uuid) {
    let query = supabase.from("pages").select("uuid, title, emoji, parent_uuid")

    if (uuid) {
      query = query.eq("parent_uuid", uuid)
    } else {
      query = query.is("parent_uuid", null)
    }

    const { data } = await query.or("is_deleted.is.null,is_deleted.is.false")

    const newData = {
      ...get().pages,
      [uuid ?? "root"]: data ? [...data] : null,
    }

    set({ pages: newData })
  },
  async getPage(uuid) {
    if (!uuid) return

    set({ loadingPage: true, page: null })

    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("uuid", uuid)
      .single()

    if (data) set({ loadingPage: false, page: data })
  },
}))
