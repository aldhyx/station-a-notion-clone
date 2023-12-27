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
  isChildDocExist(uuid: string): boolean
  insertEventHandler(doc: Page & { is_deleted: boolean | null }): void
  deleteEventHandler(doc: Page & { is_deleted: boolean | null }): void
  updateEventHandler(doc: Page & { is_deleted: boolean | null }): void
  renameDocHandler(opt: {
    uuid: string
    title: string
    emoji: Emoji | null
  }): Promise<void>
  deleteDocAsync(uuid: string): Promise<{ uuid: string } | void>
  setSidebarCollapsedList(
    v: { uuid: string; parent_uuid: string | null },
    flag?: "new",
  ): void
}

type SidebarState = {
  loading: Record<string, boolean>
  sidebarList: Map<string, Page> | null
  sidebarCollapsedList: Map<string, { uuid: string; parent_uuid: string | null }>
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
  isChildDocExist(uuid) {
    const oldList = get().sidebarList
    return oldList
      ? [...oldList.values()].some(({ parent_uuid }) => parent_uuid === uuid)
      : false
  },
  async getSidebarListAsync(uuid) {
    if (uuid && get().isChildDocExist(uuid)) return

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

    // restore from trash
    if (!oldList.has(doc.uuid) && !doc.is_deleted) {
      get().insertEventHandler(doc)
    }

    // move to trash
    if (oldList.has(doc.uuid) && doc.is_deleted) {
      get().deleteEventHandler(doc)
    }

    // normal update
    if (oldList.has(doc.uuid) && !doc.is_deleted) {
      const newList = new Map([...oldList, [doc.uuid, { ...doc }]])
      set({ sidebarList: newList })
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
  setSidebarCollapsedList({ uuid, parent_uuid }, flag) {
    const oldCollapsedList = get().sidebarCollapsedList

    if (flag === "new") {
      const oldList = get().sidebarList

      if (oldList && parent_uuid) {
        const item = oldList.get(parent_uuid)

        if (item) {
          oldCollapsedList.set(item.uuid, {
            uuid: item.uuid,
            parent_uuid: item.parent_uuid,
          })
          set({ sidebarCollapsedList: new Map([...oldCollapsedList]) })

          get().setSidebarCollapsedList(
            { uuid: parent_uuid, parent_uuid: item.parent_uuid },
            "new",
          )
        }
      }
    } else {
      if (oldCollapsedList.has(uuid)) oldCollapsedList.delete(uuid)
      else oldCollapsedList.set(uuid, { uuid, parent_uuid })

      set({ sidebarCollapsedList: new Map([...oldCollapsedList]) })
    }
  },
}))
