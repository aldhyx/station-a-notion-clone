import { client } from "@/lib/supabase/client"
import { toastError, toastLoading, toastSuccess } from "@/lib/toast"
import { toast } from "sonner"
import { create } from "zustand"

type Item = { error: string | null; path: string | null; signedUrl: string }

type GalleryState = {
  loading: boolean
  gallery: Item[] | null
}

type GalleryAction = {
  getGalleryAsync(uuidUser: string): Promise<void>
  uploadImageAsync(opt: { uuidUser: string; file: File }): Promise<void>
  deleteImageAsync(opt: { path: string | null }): Promise<void>
}

const defaultState = {
  loading: false,
  gallery: null,
}

export const useGalleryStore = create<GalleryState & GalleryAction>()((set, get) => ({
  ...defaultState,
  async getGalleryAsync(uuidUser) {
    if (get().loading) return

    set({ loading: true })
    try {
      const { data, error } = await client.storage.from("covers").list(uuidUser)
      if (error) throw new Error(error.message)

      const paths = data.map(d => uuidUser + "/" + d.name)

      if (!paths.length) {
        set({ gallery: [], loading: false })
      } else {
        const { data, error } = await client.storage
          .from("covers")
          .createSignedUrls(paths, 60)

        if (error) throw new Error(error.message)
        set({ gallery: data, loading: false })
      }
    } catch (error) {
      toastError({ message: "Failed to get gallery." })
    }
  },
  async uploadImageAsync({ file, uuidUser }) {
    try {
      const ext = file.type.split("/")[1]

      const { data, error } = await client.storage
        .from("covers")
        .upload(`/${uuidUser}/${Date.now()}.${ext}`, file)

      if (error) throw new Error(error.message)
      toastSuccess({ message: "Successfully add image to gallery." })
    } catch (error) {
      toastError({ message: "Failed to upload image!" })
    }
  },
  async deleteImageAsync({ path }) {
    if (!path) return
    const id = toast(path)
    toastLoading({ message: "Deleting delete image from gallery.", id })

    try {
      const { data, error } = await client.storage.from("covers").remove([path])
      console.log({ data, error })

      if (error) throw new Error(error.message)

      let gallery = get().gallery ?? []
      gallery = gallery.filter(item => item.path && item.path !== path)

      set({ gallery })
      toastSuccess({ message: "Successfully delete image from gallery.", id })
    } catch (error) {
      toastError({ message: "Failed to delete image from gallery!", id })
    }
  },
}))
