import { type Emoji } from "@/components/popover/emoji-picker-popover"
import { getErrorMessage } from "@/helper/error.helper"
import { client } from "@/lib/supabase/client"
import { type Database } from "@/lib/supabase/database.types"
import { toastError, toastLoading, toastSuccess } from "@/lib/toast"
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
  signedUrl: string | null
  creating: boolean
}

type DocAction = {
  setSaveStatus(status: Status): void
  createDocAsync(opt: {
    uuid?: string
    title?: string
    emoji?: Emoji
  }): Promise<{ uuid: string; parent_uuid: string | null } | void>
  getDocAsync(uuid: string): Promise<{ uuid: string; parent_uuid: string | null } | void>
  getSignedUrlAsync(opt: { uuidUser: string; imgUrl: string | null }): Promise<void>
  updateDocAsync(
    uuid: string,
    doc: Partial<Pick<Page, "content" | "description" | "emoji" | "image_url" | "title">>,
  ): Promise<void>
}

const initialState: DocState = {
  loadingDoc: true,
  doc: null,
  saveStatus: null,
  signedUrl: null,
  failedSaveData: {},
  creating: false,
}

export const useDocStore = create<DocState & DocAction>()((set, get) => ({
  ...initialState,
  setSaveStatus(status) {
    set({ saveStatus: status })
  },
  async createDocAsync({ uuid, title, emoji }) {
    set({ creating: true })
    const id = uuid ?? "create"
    toastLoading({ message: "Creating new page...", id })

    try {
      const { data, error } = await client
        .from("pages")
        .insert({ parent_uuid: uuid, title: title ?? "untitled", emoji: emoji ?? null })
        .select("uuid, parent_uuid")
        .single()

      if (error) throw new Error(error.message)

      toastSuccess({ message: "Successfully created new page.", id })
      return { uuid: data.uuid, parent_uuid: data.parent_uuid, error: null }
    } catch (error) {
      toastError({ message: "Failed to create new page.", id })
    } finally {
      set({ creating: false })
    }
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

      await get().getSignedUrlAsync({
        uuidUser: data.user_id,
        imgUrl: data.image_url,
      })

      set({ loadingDoc: false, doc: data })
      return { uuid: data.uuid, parent_uuid: data.parent_uuid }
    } catch (error) {
      toastError({ message: "Failed to load page. Broken link." })
    }
  },
  async getSignedUrlAsync({ uuidUser, imgUrl }) {
    if (!imgUrl || !uuidUser) set({ signedUrl: null })
    else {
      const [folder] = imgUrl.split("/")

      if (folder === "cover_gradients") {
        const { data } = await client.storage
          .from("app_assets")
          .createSignedUrl(imgUrl, 60)
        set({ signedUrl: data?.signedUrl ?? null })
        return
      }

      if (folder === uuidUser) {
        const { data } = await client.storage.from("covers").createSignedUrl(imgUrl, 60)
        set({ signedUrl: data?.signedUrl ?? null })
        return
      }
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

      if (
        Object.keys(doc).includes("image_url") ||
        Object.keys(get().failedSaveData).includes("image_url")
      ) {
        get().getSignedUrlAsync({
          uuidUser: data.user_id,
          imgUrl: data.image_url,
        })
      }

      set({
        loadingDoc: false,
        // update optimistic data
        doc: data,
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
