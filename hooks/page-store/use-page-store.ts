import { Emoji } from "@/components/popover/emoji-picker-popover"
import { supabase } from "@/lib/supabase/client"
import { type Database } from "@/lib/supabase/database-types"
import { toast } from "sonner"
import { create } from "zustand"

type Pages = Pick<
  Database["public"]["Tables"]["pages"]["Row"],
  "uuid" | "title" | "emoji" | "parent_uuid"
>[]

type Page = Database["public"]["Tables"]["pages"]["Row"]

type ProgressFlag = "start" | "success" | "failed" | null

type UsePageStore = {
  // sidebar page list state & mutation
  pages: Record<string, Pages | null> | null
  getPages: (uuid?: string) => Promise<void>

  // selected page change state & mutation
  page: Page | null
  loadingPage: boolean
  getPage: (uuid: string) => Promise<void>

  // modify selected page change state & mutation
  saving: ProgressFlag
  setSaving: (v: ProgressFlag) => void
  updateEmoji: ({ uuid, emoji }: { uuid: string; emoji?: Emoji }) => Promise<void>
  updateTitle: ({ uuid, title }: { uuid: string; title?: string }) => Promise<void>

  removeCover: ({ uuid }: { uuid: string }) => void
  changeCover: ({ path, uuid }: { path: string; uuid: string }) => void
}

export const usePageStore = create<UsePageStore>()((set, get) => ({
  pages: null,
  page: null,
  saving: null,
  loadingPage: false,
  setSaving: saving => set({ saving }),
  async getPages(uuid) {
    let query = supabase.from("pages").select("uuid, title, emoji, parent_uuid")

    if (uuid) {
      query = query.eq("parent_uuid", uuid)
    } else {
      query = query.is("parent_uuid", null)
    }

    const { data } = await query
      .or("is_deleted.is.null,is_deleted.is.false")
      .order("created_at", { ascending: true })

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
    else {
      throw new Error(error.message)
    }
  },
  async updateEmoji({ uuid, emoji }) {
    set({ saving: "start" })

    const { data, error } = await supabase
      .from("pages")
      .update({ emoji: emoji ?? null })
      .eq("uuid", uuid)
      .select("*")
      .single()

    if (data) set({ page: data, saving: "success" })
    else {
      set({ saving: null })
      toast.error(error.message ?? "Failed to change icon.")
    }
  },
  async updateTitle({ uuid, title }) {
    set({ saving: "start" })

    const { data, error } = await supabase
      .from("pages")
      .update({ title: title ?? null })
      .eq("uuid", uuid)
      .select("*")
      .single()

    if (data) set({ page: data, saving: "success" })
    else {
      set({ saving: null })
      toast.error(error.message ?? "Failed to change title.")
    }
  },
  async removeCover({ uuid }) {
    set({ saving: "start" })
    const { data, error } = await supabase
      .from("pages")
      .update({ image_url: null })
      .eq("uuid", uuid)
      .select("*")
      .single()

    if (data) set({ page: data, saving: "success" })
    else {
      set({ saving: null })
      toast.error("Failed to remove cover image!")
    }
  },

  async changeCover({ path, uuid }) {
    set({ saving: "start" })
    const [folder, image_url] = path.split("/")
    const { data, error } = await supabase
      .from("pages")
      .update({ image_url })
      .eq("uuid", uuid)
      .select("*")
      .single()

    if (data) set({ page: data, saving: "success" })
    else {
      set({ saving: null })
      toast.error("Failed to change cover image!")
    }
  },
}))
