import { Emoji } from "@/components/popover/emoji-picker-popover"
import { getErrorMessage } from "@/helper/error.helper"
import { client } from "@/lib/supabase/client"
import { type Database } from "@/lib/supabase/database.types"
import { toastError } from "@/lib/toast"
import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from "@supabase/supabase-js"
import { create } from "zustand"

type Page = Pick<
  Database["public"]["Tables"]["pages"]["Row"],
  "uuid" | "title" | "emoji" | "parent_uuid" | "created_at"
>
type SidebarAction = {
  getSidebarListAsync: (uuid?: string) => void
  setSidebarList(opt: {
    eventType: `${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT}`
    doc: (Page & { is_deleted: boolean | null }) | null
  }): void
  insertEventHandler(doc: Page & { is_deleted: boolean | null }): void
  deleteEventHandler(doc: Page & { is_deleted: boolean | null }): void
  updateEventHandler(doc: Page & { is_deleted: boolean | null }): void
  renameDocHandler(opt: {
    uuid: string
    title: string
    emoji: Emoji | null
  }): Promise<{ uuid: string } | void>
  setSidebarCollapsedList(uuid: string): void
}

type SidebarState = {
  loading: Record<string, boolean>
  sidebarList: Map<string, Page> | null
  sidebarCollapsedList: Map<string, string>
}

const initialState: SidebarState = {
  loading: { root: true },
  sidebarList: null,
  sidebarCollapsedList: new Map(),
}

export const useSidebarStore = create<SidebarState & SidebarAction>()((set, get) => ({
  ...initialState,
  setSidebarList({ eventType, doc }) {
    if (!doc) return
    if (eventType === "INSERT") return get().insertEventHandler(doc)
    if (eventType === "DELETE") return get().deleteEventHandler(doc)
    if (eventType === "UPDATE") return get().updateEventHandler(doc)
  },
  async getSidebarListAsync(uuid) {
    const loading = get().loading
    set({ loading: { ...loading, [uuid ?? "root"]: true } })

    try {
      let query = client
        .from("pages")
        .select("uuid, title, emoji, parent_uuid, created_at")

      if (uuid) query = query.eq("parent_uuid", uuid)
      else query = query.is("parent_uuid", null)

      const { data, error } = await query
        .or("is_deleted.is.null,is_deleted.is.false")
        .order("created_at", { ascending: true })

      if (error) throw new Error(error.message)

      const oldData = get().sidebarList
      const newData = new Map(data.map(item => [item.uuid, item]))
      const mergedData = new Map(
        oldData && oldData instanceof Map ? [...oldData, ...newData] : [...newData],
      )

      set({
        sidebarList: mergedData,
        loading: { ...loading, [uuid ?? "root"]: false },
      })
    } catch (error) {}
  },
  insertEventHandler(doc) {
    const oldData = get().sidebarList
    const isHaveOldData = oldData && oldData instanceof Map
    const newData = new Map(
      isHaveOldData ? [...oldData, [doc.uuid, doc]] : [[doc.uuid, doc]],
    )

    set({ sidebarList: newData })
  },
  deleteEventHandler(doc) {
    const oldData = get().sidebarList
    const isHaveOldData = oldData && oldData instanceof Map
    if (!isHaveOldData) return

    oldData.delete(doc.uuid)
    const newData = new Map([...oldData])
    set({ sidebarList: newData })
  },
  updateEventHandler(doc) {
    const oldData = get().sidebarList
    const isHaveOldData = oldData && oldData instanceof Map
    if (!isHaveOldData) return

    // move to trash event
    if (oldData.has(doc.uuid) && doc.is_deleted) {
      oldData.delete(doc.uuid)
      const newData = new Map([...oldData])
      set({ sidebarList: newData })
    } else {
      const newData = new Map([...oldData, [doc.uuid, doc]])
      set({ sidebarList: newData })
    }
  },
  async renameDocHandler({ uuid, title, emoji }) {
    try {
      const list = get().sidebarList
      if (!list) return

      const prevDoc = { ...list.get(uuid) } as Page

      // optimistic update
      if (list.has(uuid)) {
        list.set(uuid, { ...prevDoc, title, emoji })
        set({ sidebarList: new Map(list) })
      }

      const { error } = await client
        .from("pages")
        .update({ title: title ?? null, emoji: emoji ?? null })
        .eq("uuid", uuid)
      if (error) {
        list.set(uuid, { ...prevDoc })
        set({ sidebarList: new Map(list) })

        throw new Error(error.message)
      }

      return { uuid }
    } catch (error) {
      toastError({ message: getErrorMessage(error as Error) })
    }
  },
  setSidebarCollapsedList(uuid) {
    const old = get().sidebarCollapsedList

    if (old.has(uuid)) old.delete(uuid)
    else old.set(uuid, uuid)

    set({ sidebarCollapsedList: new Map([...old]) })
  },
}))
