import { getErrorMessage } from "@/helper/error.helper"
import { client } from "@/lib/supabase/client"
import { type Database } from "@/lib/supabase/database.types"
import { toastError } from "@/lib/toast"
import { create } from "zustand"

type Page = Database["public"]["Tables"]["pages"]["Row"]
type List = Pick<Page, "title" | "emoji" | "created_at" | "updated_at" | "uuid">

type SearchState = {
  list: List[] | null
  loading: boolean

  prevKeyword: string | null
  nextPage: number
  size: number
  more: boolean
}

type SearchAction = {
  getPagesAsync(keyword: string, next?: boolean): Promise<void>
  nextPageAsync(): Promise<void>
}

const initialState: SearchState = {
  list: null,
  loading: false,
  prevKeyword: null,

  nextPage: 1,
  size: 4 as const,
  more: false,
}

export const useSearchStore = create<SearchState & SearchAction>()((set, get) => ({
  ...initialState,
  async nextPageAsync() {
    try {
      const size = get().size
      const page = get().nextPage

      const start = page * size - size
      const end = page * size - 1
      set({ loading: true })

      const { data, error } = await client
        .from("pages")
        .select("title, emoji, created_at, updated_at, uuid")
        .or("is_deleted.is.null,is_deleted.is.false")
        .ilike("title", `%${get().prevKeyword}%`)
        .range(start, end)
        .order("created_at", { ascending: false })
      if (error) throw new Error(error.message)

      const prevList = get().list
      set({
        loading: false,
        more: data.length === size,
        list: prevList ? [...prevList, ...data] : [...data],
        nextPage: page + 1,
      })
    } catch (error) {
      set({ loading: false })

      toastError({ description: getErrorMessage(error as Error) })
    }
  },
  async getPagesAsync(keyword) {
    const prevKeyword = get().prevKeyword
    const isNewKeyword = prevKeyword !== keyword.trim().toLowerCase()

    if (!isNewKeyword || !keyword) return

    const page = 1
    const size = get().size
    const start = page * size - size
    const end = page * size - 1

    set({ loading: true, list: null })

    try {
      const { data, error } = await client
        .from("pages")
        .select("title, emoji, created_at, updated_at, uuid")
        .or("is_deleted.is.null,is_deleted.is.false")
        .ilike("title", `%${keyword}%`)
        .range(start, end)
        .order("created_at", { ascending: true })
      if (error) throw new Error(error.message)

      set({
        loading: false,
        list: [...data],
        more: data.length === size,
        prevKeyword: keyword.trim().toLowerCase(),
        nextPage: page + 1,
      })
    } catch (error) {
      set({ loading: false })

      toastError({ description: getErrorMessage(error as Error) })
    }
  },
}))
