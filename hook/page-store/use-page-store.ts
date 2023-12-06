import { type Emoji } from "@/components/popover/emoji-picker-popover"
import { client } from "@/lib/supabase/client"
import { type Database } from "@/lib/supabase/database.types"
import { toastError } from "@/lib/toast"
import { Dispatch, SetStateAction } from "react"
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
  getPagesAsync: (uuid?: string) => Promise<void>

  // selected page change state & mutation
  page: Page | null
  loadingPage: boolean
  getPageAsync: (uuid: string) => Promise<void>

  // modify selected page change state & mutation
  saving: ProgressFlag
  setSaving: (v: ProgressFlag) => void
  updateEmojiAsync(options?: { emoji: Emoji }): Promise<void>
  updateTitleAsync: ({ title }: { title?: string }) => Promise<void>

  removeCoverAsync: () => void
  changeCoverAsync: ({
    path,
    setApplying,
  }: {
    path: string | null
    setApplying: Dispatch<SetStateAction<string | null>>
  }) => void
}

export const usePageStore = create<UsePageStore>()((set, get) => ({
  pages: null,
  page: null,
  saving: null,
  loadingPage: false,
  setSaving: saving => set({ saving }),
  async getPagesAsync(uuid) {
    let query = client.from("pages").select("uuid, title, emoji, parent_uuid")

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
  async getPageAsync(uuid) {
    if (!uuid) return

    set({ loadingPage: true, page: null })

    const { data, error } = await client
      .from("pages")
      .select("*")
      .eq("uuid", uuid)
      .single()

    if (data) set({ loadingPage: false, page: data })
    else {
      throw new Error(error.message)
    }
  },
  async updateEmojiAsync(options) {
    const uuid = get().page?.uuid
    if (!uuid) return

    set({ saving: "start" })

    const { data, error } = await client
      .from("pages")
      .update({ emoji: options?.emoji ?? null })
      .eq("uuid", uuid)
      .select("*")
      .single()

    if (data) set({ page: data, saving: "success" })
    else {
      set({ saving: null })
      toastError({
        message: error.message ?? "Failed to change icon.",
      })
    }
  },
  async updateTitleAsync({ title }) {
    const uuid = get().page?.uuid
    if (!uuid) return

    set({ saving: "start" })

    const { data, error } = await client
      .from("pages")
      .update({ title: title ?? null })
      .eq("uuid", uuid)
      .select("*")
      .single()

    if (data) set({ page: data, saving: "success" })
    else {
      set({ saving: null })
      toastError({ message: error.message ?? "Failed to change title." })
    }
  },
  async removeCoverAsync() {
    const uuid = get().page?.uuid
    if (!uuid) return

    set({ saving: "start" })
    const { data } = await client
      .from("pages")
      .update({ image_url: null })
      .eq("uuid", uuid)
      .select("*")
      .single()

    if (data) set({ page: data, saving: "success" })
    else {
      set({ saving: null })
      toastError({ message: "Failed to remove cover image!" })
    }
  },
  async changeCoverAsync({ path, setApplying }) {
    const uuid = get().page?.uuid
    if (!uuid || !path) return

    set({ saving: "start" })
    setApplying(path)
    const [_, image_url] = path.split("/")
    const { data } = await client
      .from("pages")
      .update({ image_url })
      .eq("uuid", uuid)
      .select("*")
      .single()

    setApplying(null)
    if (data) set({ page: data, saving: "success" })
    else {
      set({ saving: null })
      toastError({ message: "Failed to change cover image!" })
    }
  },
}))
