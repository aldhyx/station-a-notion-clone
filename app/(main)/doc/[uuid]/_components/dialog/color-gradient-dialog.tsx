import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRef, type PropsWithChildren } from "react"
import { COLOR_AND_GRADIENT } from "@/constants/color-gradient"
import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDocStore } from "@/store/use-doc-store"
import { useParams } from "next/navigation"

type Props = PropsWithChildren

export default function ColorGradientDialog({ children }: Props) {
  const params = useParams()
  const uuid = params.uuid as string
  const { updateDocAsync, doc } = useDocStore()
  const ref = useRef<HTMLButtonElement | null>(null)
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="top-[5%] flex w-[90%] translate-y-[0] flex-col gap-0 rounded-xl p-0 py-3 md:!max-w-xl">
        <Tabs defaultValue="color_gradient" className="w-full">
          <TabsList className="h-auto w-full justify-start gap-x-3 rounded-none border-b bg-background px-3 py-0  ">
            <TabsTrigger
              value="color_gradient"
              className="rounded-none border-b-[2px] px-0 data-[state=active]:border-b-primary"
            >
              Color & Gradient
            </TabsTrigger>
          </TabsList>

          <TabsContent value="color_gradient" className="m-0 px-3 pt-3">
            <div className="relative grid grid-cols-4 gap-2">
              {COLOR_AND_GRADIENT.map(d => {
                return (
                  <div
                    role="button"
                    key={d.name}
                    className="group relative h-[72px] overflow-clip rounded-md transition hover:opacity-70"
                    style={{
                      background: d.background,
                    }}
                    onClick={() => {
                      updateDocAsync(uuid, { image_url: d.name })
                      ref.current?.click()
                    }}
                  >
                    {doc?.image_url && (
                      <div
                        className={cn("absolute grid h-full w-full place-content-center")}
                      >
                        {doc.image_url === d.name && (
                          <CheckIcon className="h-8 w-8 text-secondary" />
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <DialogClose ref={ref} hidden>
              close
            </DialogClose>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
