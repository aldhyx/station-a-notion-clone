import { type Emoji } from "@/components/popover/emoji-picker-popover"
import { client } from "@/lib/supabase/client"
import { type Database } from "@/lib/supabase/database.types"
import { toastError, toastLoading, toastSuccess } from "@/lib/toast"
import { create } from "zustand"

type Page = Database["public"]["Tables"]["pages"]["Row"]
type ErrorResponse = Promise<
  { uuid: string; error: null } | { error: string; uuid: null }
>
type Status = "start" | "success" | "failed" | null

type DocState = {
  saving: {
    uuid?: string | null
    status: Status
  }
  creatingDoc: boolean
  loadingDoc: boolean
  doc: Page | null
  signedUrl: string | null
}

type DocAction = {
  setSavingDoc(opt: { uuid: string | null; status: Status }): void
  createDocAsync(uuid?: string): ErrorResponse
  deleteDocAsync(uuid: string): ErrorResponse
  getDocAsync(uuid: string): ErrorResponse
  updateEmojiAsync(opt: { uuid: string; emoji?: Emoji }): ErrorResponse
  updateTitleAsync(opt: {
    uuid: string
    title?: string
  }): Promise<{ title: string; error: null } | { error: string; title: null }>
  updateCoverAsync(opt: { uuid: string; path?: string | null }): ErrorResponse
  getSignedUrlAsync(opt: { uuidUser: string; imgUrl: string | null }): Promise<void>
}

const initialState: DocState = {
  creatingDoc: false,
  loadingDoc: false,
  doc: null,
  signedUrl: null,
  saving: {
    status: null,
    uuid: null,
  },
}
export const useDocStore = create<DocState & DocAction>()((set, get) => ({
  ...initialState,
  setSavingDoc(opt) {
    set({ saving: { ...opt } })
  },
  async createDocAsync(uuid) {
    set({ creatingDoc: true })

    const id = uuid ?? "create"
    toastLoading({ message: "Creating new page...", id })

    try {
      const { data, error } = await client
        .from("pages")
        .insert({ parent_uuid: uuid })
        .select("uuid")
        .single()

      set({ creatingDoc: false })

      if (data) {
        toastSuccess({ message: "Successfully created new page.", id })
        return { uuid: data.uuid, error: null }
      }

      throw new Error(error.message)
    } catch (error) {
      const message = "Failed to create new page."
      toastError({ message, id })
      return { error: message, uuid: null }
    }
  },
  async deleteDocAsync(uuid) {
    const id = uuid ?? "create"

    try {
      const { error, data } = await client
        .from("pages")
        .update({ is_deleted: true, parent_uuid: null })
        .eq("uuid", uuid)

      if (error) throw new Error(error.message)

      toastSuccess({ message: "Moved to trash successfully.", id })
      return { uuid, error: null }
    } catch (error) {
      const message = "Move to trash failed."
      toastError({ message, id })
      return { uuid: null, error: message }
    }
  },
  async getDocAsync(uuid) {
    set({ loadingDoc: true, doc: null })

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
      return { uuid: data.uuid, error: null }
    } catch (error) {
      const message = "Failed to load page. Broken link!"
      toastError({ message })
      return { uuid: null, error: message }
    }
  },
  async updateEmojiAsync(opt) {
    set({
      saving: { status: "start", uuid: opt.uuid },
    })

    try {
      const { data, error } = await client
        .from("pages")
        .update({ emoji: opt.emoji ?? null })
        .eq("uuid", opt.uuid)
        .select("*")
        .single()
      if (error) throw new Error(error.message)

      set({
        saving: { status: "success", uuid: opt.uuid },
        doc: data,
      })
      return { uuid: opt.uuid, error: null }
    } catch (error) {
      const message = "Failed to change emoji"
      toastError({ message })
      return { error: message, uuid: null }
    }
  },
  async updateTitleAsync(opt) {
    set({
      saving: { status: "start", uuid: opt.uuid },
    })

    try {
      const { data, error } = await client
        .from("pages")
        .update({ title: opt.title || "untitled" })
        .eq("uuid", opt.uuid)
        .select("*")
        .single()
      if (error) throw new Error(error.message)

      set({
        saving: { status: "success", uuid: opt.uuid },
        doc: data,
      })

      return { title: data.title!, error: null }
    } catch (error) {
      const message = "Failed to change title"
      toastError({ message })
      return { error: message, title: null }
    }
  },
  async updateCoverAsync(opt) {
    set({
      saving: { status: "start", uuid: opt.uuid },
    })

    try {
      const image_url = opt.path ? opt.path.split("/")[1] : null

      const { data, error } = await client
        .from("pages")
        .update({ image_url })
        .eq("uuid", opt.uuid)
        .select("*")
        .single()

      if (error) throw new Error(error.message)

      await get().getSignedUrlAsync({
        uuidUser: data.user_id,
        imgUrl: data.image_url,
      })

      set({
        saving: { status: "success", uuid: opt.uuid },
        doc: data,
      })
      return { uuid: opt.uuid, error: null }
    } catch (error) {
      const message = "Failed to change cover image!"
      toastError({ message })
      return { error: message, uuid: null }
    }
  },
  async getSignedUrlAsync({ uuidUser, imgUrl }) {
    if (!imgUrl) {
      set({ signedUrl: null })
      return
    }

    const { data, error } = await client.storage
      .from("covers")
      .createSignedUrl(`${uuidUser}/${imgUrl}`, 60)
    set({ signedUrl: data?.signedUrl ?? null })
  },
}))
