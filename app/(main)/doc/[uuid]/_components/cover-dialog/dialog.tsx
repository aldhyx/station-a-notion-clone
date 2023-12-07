import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGalleryStore } from "@/store/use-gallery-store"
import { useUserStore } from "@/store/use-user-store"
import { useState, type PropsWithChildren } from "react"
import Gallery from "./gallery"
import Upload from "./upload"

type Props = PropsWithChildren

export default function CoverDialog({ children }: Props) {
  const [tab, setTab] = useState<"gallery" | "upload">("gallery")
  const { currentUser } = useUserStore()
  const { getGalleryAsync } = useGalleryStore()

  return (
    <Dialog
      onOpenChange={open => {
        if (open && currentUser?.id) getGalleryAsync(currentUser.id)
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="top-[5%] max-w-sm translate-y-[0] gap-0 px-0 pb-6 pt-14 md:max-w-lg">
        <Tabs value={tab} className="w-full">
          <TabsList className="h-auto w-full justify-start gap-x-3 rounded-none border-b border-b-zinc-200 bg-background px-4 py-0">
            <TabsTrigger
              value="gallery"
              onClick={() => setTab("gallery")}
              className="rounded-none border-b-[2px] border-b-background px-0 data-[state=active]:border-b-zinc-800"
            >
              Gallery
            </TabsTrigger>
            <TabsTrigger
              onClick={() => setTab("upload")}
              value="upload"
              className="rounded-none border-b-[2px] border-b-background px-0 data-[state=active]:border-b-zinc-800"
            >
              Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="m-0 px-4 pt-4">
            <Gallery />
          </TabsContent>

          <TabsContent value="upload" className="m-0 px-4 pt-4">
            <Upload />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
