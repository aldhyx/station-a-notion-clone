import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import { type PropsWithChildren } from "react"

export default function DeleteImageDialog({
  children,
  deleteImageHandler,
}: PropsWithChildren & {
  deleteImageHandler: () => void
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        className="max-w-sm overflow-hidden rounded-md bg-background p-0"
        hideCloseButton
      >
        <DialogHeader className="p-4">
          <DialogDescription className="leading-1 text-left text-zinc-800">
            Are you sure, dou you want to permanently delete image from gallery ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="w-full flex-row gap-0 border-t border-zinc-200">
          <Button
            type="button"
            size="lg"
            variant="secondary"
            className="flex-1 rounded-bl-xl"
            onClick={e => {
              e.stopPropagation()
              deleteImageHandler()
            }}
          >
            Yes, Delete
          </Button>
          <div className="!m-0 box-border h-full w-[1px] border-r border-zinc-200 p-0" />
          <DialogClose asChild className="!m-0">
            <Button
              type="button"
              size="lg"
              className="flex-1 rounded-br-xl"
              variant="secondary"
            >
              No
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
