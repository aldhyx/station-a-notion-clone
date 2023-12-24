import { Emoji } from "@/components/popover/emoji-picker-popover"
import { getErrorMessage } from "@/helper/error.helper"
import { client } from "@/lib/supabase/client"
import { type Database } from "@/lib/supabase/database.types"
import { toastError, toastSuccess } from "@/lib/toast"
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
  }): Promise<void>
  deleteDocAsync(uuid: string): Promise<{ uuid: string } | void>
  setSidebarCollapsedList(uuid: string, flag?: "new"): void
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

      const oldList = get().sidebarList
      const newList = new Map(data.map(item => [item.uuid, item]))
      const mergedList = new Map(
        oldList && oldList instanceof Map ? [...oldList, ...newList] : [...newList],
      )

      set({
        sidebarList: mergedList,
        loading: { ...loading, [uuid ?? "root"]: false },
      })
    } catch (error) {}
  },
  insertEventHandler(doc) {
    const oldList = get().sidebarList
    const newList = new Map(
      oldList ? [...oldList, [doc.uuid, { ...doc }]] : [[doc.uuid, { ...doc }]],
    )

    set({ sidebarList: newList })
  },
  deleteEventHandler(doc) {
    const oldList = get().sidebarList
    if (!oldList) return

    oldList.delete(doc.uuid)
    const newList = new Map([...oldList])
    set({ sidebarList: newList })
  },
  updateEventHandler(doc) {
    const oldList = get().sidebarList
    if (!oldList) return

    if (oldList.has(doc.uuid)) {
      // move to trash event
      if (doc.is_deleted) {
        oldList.delete(doc.uuid)
        const newList = new Map([...oldList])
        set({ sidebarList: newList })
      } else {
        const newList = new Map([...oldList, [doc.uuid, { ...doc }]])
        set({ sidebarList: newList })
      }
    }
  },
  async renameDocHandler({ uuid, title, emoji }) {
    const oldList = get().sidebarList
    if (!oldList) return

    const item = oldList.get(uuid) ?? (null as Page | null)

    // optimistic update
    if (item) {
      oldList.set(uuid, { ...item, title, emoji })
      set({ sidebarList: new Map(oldList) })
    }

    try {
      const { error } = await client
        .from("pages")
        .update({ title: title ?? null, emoji: emoji ?? null })
        .eq("uuid", uuid)

      if (error) throw new Error(error.message)
    } catch (error) {
      // restore if error
      if (item) {
        oldList.set(uuid, { ...item })
        set({ sidebarList: new Map(oldList) })
      }

      toastError({ message: getErrorMessage(error as Error) })
    }
  },
  async deleteDocAsync(uuid) {
    const oldList = get().sidebarList
    if (!oldList) return

    const item = oldList.get(uuid) ?? (null as Page | null)

    // optimistic update
    if (item) {
      oldList.delete(uuid)
      set({ sidebarList: new Map(oldList) })
    }

    try {
      const { error } = await client
        .from("pages")
        .update({ is_deleted: true, parent_uuid: null })
        .eq("uuid", uuid)

      if (error) throw new Error(error.message)

      toastSuccess({ message: "Moved to trash successfully." })
      return { uuid }
    } catch (error) {
      // restore if error
      if (item) {
        oldList.set(uuid, { ...item })
        set({ sidebarList: new Map(oldList) })
      }

      toastError({ message: "Move to trash failed." })
    }
  },
  setSidebarCollapsedList(uuid, flag) {
    const oldList = get().sidebarCollapsedList

    if (flag === "new") {
      const side = get().sidebarList
      // todo loop over to find parent then set into new array, until null then apply to store
    } else {
      if (oldList.has(uuid)) oldList.delete(uuid)
      else oldList.set(uuid, uuid)

      set({ sidebarCollapsedList: new Map([...oldList]) })
    }
  },
}))
