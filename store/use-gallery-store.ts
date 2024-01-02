import { client } from "@/lib/supabase/client"
import { toastError, toastLoading, toastSuccess } from "@/lib/toast"
import { toast } from "sonner"
import { create } from "zustand"

type Item = { error: string | null; path: string | null; signedUrl: string }

type GalleryState = {
  loadPictures: boolean
  loadGradients: boolean
  pictures: Item[] | null
  gradients: Item[] | null
}

type GalleryAction = {
  getPicturesAsync(uuidUser: string): Promise<void>
  getGradientsAsync(): Promise<void>
  uploadImageAsync(opt: { uuidUser: string; file: File }): Promise<void>
  deleteImageAsync(opt: { path: string | null }): Promise<void>
}

const defaultState = {
  loadPictures: false,
  loadGradients: false,
  pictures: null,
  gradients: null,
}

export const useGalleryStore = create<GalleryState & GalleryAction>()((set, get) => ({
  ...defaultState,
  async getGradientsAsync() {
    set({ loadGradients: true })
    try {
      const { data, error } = await client.storage
        .from("app_assets")
        .list("cover_gradients", { limit: 10 })

      if (error) throw new Error(error.message)

      const paths = data.map(d => "cover_gradients/" + d.name)

      if (paths.length === 0) set({ gradients: [], loadGradients: false })
      else {
        const { data, error } = await client.storage
          .from("app_assets")
          .createSignedUrls(paths, 60)

        if (error) throw new Error(error.message)
        set({ gradients: data, loadGradients: false })
      }
    } catch (error) {}
  },
  async getPicturesAsync(uuidUser) {
    set({ loadPictures: true })
    try {
      const { data, error } = await client.storage.from("covers").list(uuidUser)
      if (error) throw new Error(error.message)

      const paths = data.map(d => uuidUser + "/" + d.name)

      if (!paths.length) set({ pictures: [], loadPictures: false })
      else {
        const { data, error } = await client.storage
          .from("covers")
          .createSignedUrls(paths, 60)

        if (error) throw new Error(error.message)
        set({ pictures: data, loadPictures: false })
      }
    } catch (error) {}
  },
  async uploadImageAsync({ file, uuidUser }) {
    try {
      const ext = file.type.split("/")[1]

      const { data, error } = await client.storage
        .from("covers")
        .upload(`/${uuidUser}/${Date.now()}.${ext}`, file)

      if (error) throw new Error(error.message)
      toastSuccess({ description: "Successfully add image to gallery." })
    } catch (error) {
      toastError({ description: "Failed to upload image!" })
    }
  },
  async deleteImageAsync({ path }) {
    if (!path) return
    const id = toast(path)
    toastLoading({ description: "Deleting delete image from gallery.", id })

    try {
      const { data, error } = await client.storage.from("covers").remove([path])
      if (error) throw new Error(error.message)

      let pictures = get().pictures ?? []
      pictures = pictures.filter(item => item.path && item.path !== path)

      set({ pictures })
      toastSuccess({ description: "Successfully delete image from gallery.", id })
    } catch (error) {
      toastError({ description: "Failed to delete image from gallery!", id })
    }
  },
}))
