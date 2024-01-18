"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlayCustom,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useTrashStore } from "@/store/use-trash-store"
import { useRouter } from "next/navigation"
import { PropsWithChildren, useRef } from "react"

export default function DeleteDialog({
  children,
  uuid,
  redirectTo,
}: PropsWithChildren & {
  uuid: string
  /**
   * redirect url, example /doc
   */
  redirectTo?: string
}) {
  const { deletePagePermanent } = useTrashStore()
  const ref = useRef<HTMLButtonElement>(null)
  const router = useRouter()

  return (
    <Dialog modal>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        overlay={<DialogOverlayCustom classnames="bg-primary/30" />}
        className="w-[90%] gap-0 rounded-xl p-0 md:max-w-sm"
        hideCloseButton
      >
        <DialogHeader className="p-4">
          <DialogDescription className="leading-1 text-left text-primary">
            Are you sure, do you want to permanently delete this page?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="w-full flex-row gap-0 border-t">
          <Button
            type="button"
            size="lg"
            variant="ghost"
            className="flex-1 rounded-none rounded-bl-xl text-destructive hover:text-destructive"
            onClick={() => {
              deletePagePermanent(uuid)
              ref.current?.click()
              if (redirectTo) router.replace(redirectTo)
            }}
          >
            Yes
          </Button>
          <div className="!m-0 box-border h-full w-[1px] border-r p-0" />
          <DialogClose asChild className="!m-0">
            <Button
              type="button"
              size="lg"
              className="flex-1 rounded-none rounded-br-xl"
              variant="ghost"
              ref={ref}
            >
              No
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
