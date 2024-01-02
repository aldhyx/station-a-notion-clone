import { type Emoji } from "@/components/popover/emoji-picker-popover"
import { getErrorMessage } from "@/helper/error.helper"
import { client } from "@/lib/supabase/client"
import { type Database } from "@/lib/supabase/database.types"
import { toastError, toastLoading, toastSuccess } from "@/lib/toast"
import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from "@supabase/supabase-js"
import { create } from "zustand"

type Page = Database["public"]["Tables"]["pages"]["Row"]

type Status = "start" | "success" | "failed" | null

type DocState = {
  saveStatus: Status
  failedSaveData: Partial<
    Pick<Page, "content" | "description" | "emoji" | "image_url" | "title">
  >
  loadingDoc: boolean
  doc: Page | null
}

type DocAction = {
  setSaveStatus(status: Status): void
  getDocAsync(uuid: string): Promise<{ uuid: string; parent_uuid: string | null } | void>
  updateDocAsync(
    uuid: string,
    doc: Partial<Pick<Page, "content" | "description" | "emoji" | "image_url" | "title">>,
  ): Promise<void>
  docRealtimeHandler(opt: {
    eventType: `${REALTIME_POSTGRES_CHANGES_LISTEN_EVENT}`
    doc: Page
  }): void
  _updateDoc(doc: Page): void
}

const initialState: DocState = {
  saveStatus: null,
  loadingDoc: true,
  doc: null,
  failedSaveData: {},
}

export const useDocStore = create<DocState & DocAction>()((set, get) => ({
  ...initialState,
  setSaveStatus(status) {
    set({ saveStatus: status })
  },
  docRealtimeHandler({ eventType, doc }) {
    // Todo: handle deleted document
    // if (eventType === "DELETE") return get()._deleteFromSidebarTree(doc)
    if (eventType === "UPDATE") return get()._updateDoc(doc)
  },
  _updateDoc(doc) {
    const oldDoc = get().doc
    if (!oldDoc || oldDoc.uuid !== doc.uuid) return

    // Todo: handle CDRT, https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type
    console.log("update", doc)
    set({ doc })
  },
  async getDocAsync(uuid) {
    set({ ...initialState })

    try {
      const { data, error } = await client
        .from("pages")
        .select("*")
        .eq("uuid", uuid)
        .single()

      if (error) throw new Error(error.message)

      set({ loadingDoc: false, doc: data })
      return { uuid: data.uuid, parent_uuid: data.parent_uuid }
    } catch (error) {
      toastError({ message: "Something went wrong. Failed to load page." })
    }
  },

  async updateDocAsync(uuid, doc) {
    try {
      set({
        saveStatus: "start",
        // optimistic update
        doc: {
          ...get().doc,
          ...(doc as Page),
        },
      })

      const { data, error } = await client
        .from("pages")
        .update({
          ...get().failedSaveData,
          ...doc,
        })
        .eq("uuid", uuid)
        .select("*")
        .single()

      if (error) throw new Error(error.message)

      set({
        loadingDoc: false,
        saveStatus: "success",
        failedSaveData: {},
      })
    } catch (error) {
      set({
        saveStatus: "failed",
        failedSaveData: { ...get().failedSaveData, ...doc },
      })

      toastError({ message: "Failed to save changes." })
    }
  },
}))
