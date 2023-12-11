import { getErrorMessage } from "@/helper/error.helper"
import { client } from "@/lib/supabase/client"
import { type Database } from "@/lib/supabase/database.types"
import { toastError, toastSuccess } from "@/lib/toast"
import { create } from "zustand"

type Page = Database["public"]["Tables"]["pages"]["Row"]
type List = Pick<
  Page,
  "title" | "emoji" | "created_at" | "updated_at" | "uuid" | "is_deleted"
>

type TrashState = {
  list: List[] | null
  loading: boolean

  prevKeyword: string | null
  nextPage: number
  size: number
  more: boolean
}

type TrashAction = {
  getTrashAsync(keyword?: string | null): Promise<void>
  nextPageAsync(): Promise<void>
  deletePagePermanent(uuid: string): Promise<void>
  restorePageAsync(uuid: string): Promise<void>
}

const initialState: TrashState = {
  list: null,
  loading: false,
  prevKeyword: null,

  nextPage: 1,
  size: 10 as const,
  more: false,
}

export const useTrashStore = create<TrashAction & TrashState>()((set, get) => ({
  ...initialState,
  async nextPageAsync() {
    try {
      const size = get().size
      const page = get().nextPage

      const start = page * size - size
      const end = page * size - 1
      set({ loading: true })

      const query = client
        .from("pages")
        .select("title, emoji, created_at, updated_at, uuid, is_deleted")

      if (get().prevKeyword) {
        const { data, error } = await query
          .eq("is_deleted", true)
          .ilike("title", `%${get().prevKeyword}%`)
          .range(start, end)

        if (error) throw new Error(error.message)
        const prevList = get().list

        set({
          loading: false,
          more: data.length === size,
          list: prevList ? [...prevList, ...data] : [...data],
          nextPage: page + 1,
        })
      } else {
        const { data, error } = await query.eq("is_deleted", true).range(start, end)

        if (error) throw new Error(error.message)
        const prevList = get().list

        set({
          loading: false,
          more: data.length === size,
          list: prevList ? [...prevList, ...data] : [...data],
          nextPage: page + 1,
        })
      }
    } catch (error) {
      set({ loading: false })

      toastError({ message: getErrorMessage(error as Error) })
    }
  },
  async getTrashAsync(keyword) {
    const prevKeyword = get().prevKeyword
    const isNewKeyword = keyword ? prevKeyword !== keyword.trim().toLowerCase() : true

    if (!isNewKeyword) return

    const page = 1
    const size = get().size
    const start = page * size - size
    const end = page * size - 1

    set({ loading: true, list: null })

    try {
      const query = client
        .from("pages")
        .select("title, emoji, created_at, updated_at, uuid, is_deleted")

      if (keyword) {
        const { data, error } = await query
          .eq("is_deleted", true)
          .ilike("title", `%${keyword}%`)
          .range(start, end)
        if (error) throw new Error(error.message)

        set({
          loading: false,
          list: [...data],
          more: data.length === size,
          prevKeyword: keyword.trim().toLowerCase(),
          nextPage: page + 1,
        })
      } else {
        const { data, error } = await query.eq("is_deleted", true).range(start, end)
        if (error) throw new Error(error.message)

        set({
          loading: false,
          list: [...data],
          more: data.length === size,
          prevKeyword: null,
          nextPage: page + 1,
        })
      }
    } catch (error) {
      set({ loading: false })

      toastError({ message: getErrorMessage(error as Error) })
    }
  },
  async deletePagePermanent(uuid) {
    try {
      const { data, error, status } = await client.from("pages").delete().eq("uuid", uuid)
      if (error) throw new Error(error.message)

      let list = get().list
      list = list ? list?.filter(i => i.uuid !== uuid) : null
      set({ list })
      toastSuccess({ message: "Successfully delete page permanently." })
    } catch (error) {
      toastError({ message: getErrorMessage(error as Error) })
    }
  },
  async restorePageAsync(uuid) {
    try {
      const { data, error, status } = await client
        .from("pages")
        .update({ is_deleted: null, parent_uuid: null })
        .eq("uuid", uuid)

      if (error) throw new Error(error.message)
      toastSuccess({ message: "Successfully restore page." })
    } catch (error) {
      toastError({ message: getErrorMessage(error as Error) })
    }
  },
}))
