import { Emoji } from "@/components/popover/emoji-picker-popover"
import { client } from "@/lib/supabase/client"
import { type Database } from "@/lib/supabase/database.types"
import { toastError, toastLoading } from "@/lib/toast"
import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from "@supabase/supabase-js"
import { toast } from "sonner"
import { create } from "zustand"

type Page = Pick<
  Database["public"]["Tables"]["pages"]["Row"],
  "uuid" | "title" | "emoji" | "parent_uuid" | "created_at" | "updated_at" | "is_locked"
>
type SidebarAction = {
  childExistInSidebarTree(uuid: string): boolean
  sidebarTreeCollapseHandler(
    v: { uuid: string; parent_uuid: string | null },
    flag?: "new",
  ): void
  sidebarTreeRealtimeHandler(opt: {
    eventType: `${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT}`
    doc: Page & { is_deleted: boolean | null }
  }): void
  _insertIntoSidebarTree(doc: Page & { is_deleted: boolean | null }): void
  _deleteFromSidebarTree(doc: Page & { is_deleted: boolean | null }): void
  _updateSidebarTree(doc: Page & { is_deleted: boolean | null }): void
  getSidebarTreeAsync: (uuid?: string) => void
  renameDocAsync(opt: { uuid: string; title: string; emoji: Emoji | null }): Promise<void>
  deleteDocAsync(uuid: string): Promise<{ uuid: string } | void>
  createDocAsync(opt: {
    uuid?: string
    title?: string
    emoji?: Emoji
  }): Promise<{ uuid: string; parent_uuid: string | null } | void>
}

type SidebarState = {
  loading: Record<string, boolean>
  sidebarTree: Map<string, Page> | null
  sidebarTreeCollapsed: Map<string, { uuid: string; parent_uuid: string | null }>
}

const initialState: SidebarState = {
  loading: { root: true },
  sidebarTree: null,
  sidebarTreeCollapsed: new Map(),
}

export const useSidebarStore = create<SidebarState & SidebarAction>()((set, get) => ({
  ...initialState,
  childExistInSidebarTree(uuid) {
    const oldTree = get().sidebarTree
    return oldTree
      ? [...oldTree.values()].some(({ parent_uuid }) => parent_uuid === uuid)
      : false
  },
  sidebarTreeRealtimeHandler({ eventType, doc }) {
    if (eventType === "INSERT") return get()._insertIntoSidebarTree(doc)
    if (eventType === "DELETE") return get()._deleteFromSidebarTree(doc)
    if (eventType === "UPDATE") return get()._updateSidebarTree(doc)
  },
  async getSidebarTreeAsync(uuid) {
    if (uuid && get().childExistInSidebarTree(uuid)) return

    const loading = get().loading
    set({ loading: { ...loading, [uuid ?? "root"]: true } })

    try {
      let query = client
        .from("pages")
        .select("uuid, title, emoji, parent_uuid, created_at, updated_at, is_locked")

      if (uuid) query = query.eq("parent_uuid", uuid)
      else query = query.is("parent_uuid", null)

      const { data, error } = await query
        .or("is_deleted.is.null,is_deleted.is.false")
        .order("created_at", { ascending: true })

      if (error) throw new Error(error.message)

      const oldTree = get().sidebarTree
      const newTree = new Map(data.map(item => [item.uuid, item]))
      const mergedTree = new Map(oldTree ? [...oldTree, ...newTree] : [...newTree])

      set({
        sidebarTree: mergedTree,
        loading: { ...loading, [uuid ?? "root"]: false },
      })
    } catch (error) {
      toastError({
        description:
          "Failed to load sidebar tree. Please check your internet connection & try again.",
      })
    }
  },
  _insertIntoSidebarTree(doc) {
    const oldTree = get().sidebarTree
    const mergedTree = new Map(
      oldTree ? [...oldTree, [doc.uuid, { ...doc }]] : [[doc.uuid, { ...doc }]],
    )

    set({ sidebarTree: mergedTree })
  },
  _deleteFromSidebarTree(doc) {
    const oldTree = get().sidebarTree
    if (!oldTree) return

    oldTree.delete(doc.uuid)
    set({ sidebarTree: new Map([...oldTree]) })
  },
  _updateSidebarTree(doc) {
    const oldTree = get().sidebarTree
    if (!oldTree) return

    // restore from trash
    if (!oldTree.has(doc.uuid) && !doc.is_deleted) {
      get()._insertIntoSidebarTree(doc)
    }

    // move to trash
    if (oldTree.has(doc.uuid) && doc.is_deleted) {
      get()._deleteFromSidebarTree(doc)
    }

    // normal update
    if (oldTree.has(doc.uuid) && !doc.is_deleted) {
      const mergedTree = new Map([...oldTree, [doc.uuid, { ...doc }]])
      set({ sidebarTree: mergedTree })
    }
  },
  async renameDocAsync({ uuid, title, emoji }) {
    const oldTree = get().sidebarTree
    if (!oldTree) return

    const item = oldTree.has(uuid) ? oldTree.get(uuid) : null
    if (item) {
      // optimistic sidebar tree update
      oldTree.set(uuid, { ...item, title, emoji })
      set({ sidebarTree: new Map(oldTree) })
    }

    try {
      const { error } = await client
        .from("pages")
        .update({ title: title ?? null, emoji: emoji ?? null })
        .eq("uuid", uuid)

      if (error) throw new Error(error.message)
    } catch (error) {
      if (item) {
        // restore if error
        oldTree.set(uuid, { ...item })
        set({ sidebarTree: new Map(oldTree) })
      }

      toastError({
        description:
          "Failed to rename selected doc. Please check your internet connection & try again.",
      })
    }
  },
  async deleteDocAsync(uuid) {
    const oldTree = get().sidebarTree
    if (!oldTree) return

    const item = oldTree.has(uuid) ? oldTree.get(uuid) : null

    if (item) {
      // optimistic update
      oldTree.delete(uuid)
      set({ sidebarTree: new Map(oldTree) })
    }

    try {
      const { error } = await client
        .from("pages")
        .update({ is_deleted: true, parent_uuid: null })
        .eq("uuid", uuid)

      if (error) throw new Error(error.message)

      return { uuid }
    } catch (error) {
      if (item) {
        // restore if error
        oldTree.set(uuid, { ...item })
        set({ sidebarTree: new Map(oldTree) })
      }

      toastError({
        description:
          "Move to trash failed. Please check your internet connection & try again.",
      })
    }
  },

  async createDocAsync({ uuid, title, emoji }) {
    const id = uuid ?? "create"
    const tid = toastLoading({ description: "Creating new page...", id })

    try {
      const { data, error } = await client
        .from("pages")
        .insert({ parent_uuid: uuid, title: title ?? "untitled", emoji: emoji ?? null })
        .select("uuid, parent_uuid")
        .single()

      if (error) throw new Error(error.message)

      toast.dismiss(tid)
      return { uuid: data.uuid, parent_uuid: data.parent_uuid, error: null }
    } catch (error) {
      toastError({
        description:
          "Failed to create new page. Please check your internet connection & try again.",
        id,
      })
    }
  },
  sidebarTreeCollapseHandler({ uuid, parent_uuid }, flag) {
    const oldCollapsedList = get().sidebarTreeCollapsed

    if (flag === "new") {
      const oldTree = get().sidebarTree

      if (oldTree && parent_uuid) {
        const item = oldTree.get(parent_uuid)

        if (item) {
          oldCollapsedList.set(item.uuid, {
            uuid: item.uuid,
            parent_uuid: item.parent_uuid,
          })
          set({ sidebarTreeCollapsed: new Map([...oldCollapsedList]) })

          get().sidebarTreeCollapseHandler(
            { uuid: parent_uuid, parent_uuid: item.parent_uuid },
            "new",
          )
        }
      }
    } else {
      if (oldCollapsedList.has(uuid)) oldCollapsedList.delete(uuid)
      else oldCollapsedList.set(uuid, { uuid, parent_uuid })

      set({ sidebarTreeCollapsed: new Map([...oldCollapsedList]) })
    }
  },
}))
