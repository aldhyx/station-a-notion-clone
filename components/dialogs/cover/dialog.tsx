import { useUserStore } from "@/hooks/use-user-store"
import { getApiError } from "@/lib/error/api-error"
import { supabase } from "@/lib/supabase/client"
import { useState, type PropsWithChildren } from "react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogTrigger } from "../../ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import Gallery from "./gallery"
import Upload from "./upload"

type Props = PropsWithChildren
type Gallery = { error: string | null; path: string | null; signedUrl: string }

export default function CoverDialog({ children }: Props) {
  const [tabs, setTabs] = useState<"gallery" | "upload">("gallery")
  const [gallery, setGallery] = useState<null | Gallery[]>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const { currentUser } = useUserStore()

  const getImageList = async (uuidUser?: string) => {
    if (!uuidUser) return

    try {
      const { data, error } = await supabase.storage.from("covers").list(uuidUser)
      if (error) throw new Error(error.message)

      const paths = data.map(d => uuidUser + "/" + d.name)

      if (paths.length === 0) throw new Error("Empty gallery")
      else {
        const { data, error } = await supabase.storage
          .from("covers")
          .createSignedUrls(paths, 60)
        if (data?.length) setGallery(data)
        else throw new Error(error ? error.message : "Empty gallery")
      }

      setLoading(false)
    } catch (error) {
      setGallery(null)
      setLoading(false)
      toast.error(getApiError(error))
    }
  }

  return (
    <Dialog
      onOpenChange={open => {
        if (open) {
          setTabs("gallery")
          getImageList(currentUser?.id)
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="top-[5%] max-w-sm translate-y-[0] gap-0 px-0 pb-6 pt-14 md:max-w-lg"
        onInteractOutside={e => {
          return e.preventDefault()
        }}
      >
        <Tabs value={tabs} className="w-full">
          <TabsList className="h-auto w-full justify-start gap-x-3 rounded-none border-b border-b-zinc-200 bg-background px-4 py-0">
            <TabsTrigger
              value="gallery"
              onClick={() => setTabs("gallery")}
              className="rounded-none border-b-[2px] border-b-background px-0 data-[state=active]:border-b-zinc-800"
            >
              Gallery
            </TabsTrigger>
            <TabsTrigger
              onClick={() => setTabs("upload")}
              value="upload"
              className="rounded-none border-b-[2px] border-b-background px-0 data-[state=active]:border-b-zinc-800"
            >
              Upload
            </TabsTrigger>
          </TabsList>
          <TabsContent value="gallery" className="m-0 px-4 pt-4">
            <Gallery gallery={gallery} loading={loading} />
          </TabsContent>
          <TabsContent value="upload" className="m-0 px-4 pt-4">
            <Upload getImageList={getImageList} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
