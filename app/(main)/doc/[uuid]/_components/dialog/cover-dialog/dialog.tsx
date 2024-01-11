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

  const { getGradientsAsync, getPicturesAsync } = useGalleryStore()
  const openChangeHandler = (open: boolean) => {
    if (open && currentUser?.id) {
      getPicturesAsync(currentUser.id)
      getGradientsAsync()
    }
  }

  return (
    <Dialog onOpenChange={openChangeHandler}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="top-[5%] flex w-[90%] translate-y-[0] flex-col gap-0 rounded-xl p-0 py-3 md:!max-w-xl"
        hideCloseButton
      >
        <Tabs value={tab} className="w-full">
          <TabsList className="h-auto w-full justify-start gap-x-3 rounded-none border-b bg-background px-3 py-0  ">
            <TabsTrigger
              value="gallery"
              onClick={() => setTab("gallery")}
              className="rounded-none border-b-[2px] px-0 data-[state=active]:border-b-primary"
            >
              Gallery
            </TabsTrigger>
            <TabsTrigger
              onClick={() => setTab("upload")}
              value="upload"
              className="rounded-none border-b-[2px] px-0 data-[state=active]:border-b-primary"
            >
              Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="m-0 px-3 pt-3">
            <Gallery />
          </TabsContent>

          <TabsContent value="upload" className="m-0 px-3 pt-3">
            <Upload />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
