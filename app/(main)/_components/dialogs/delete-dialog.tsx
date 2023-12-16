"use client"

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
import { useTrashStore } from "@/store/use-trash-store"
import { PropsWithChildren, useRef } from "react"

export default function DeleteDialog({
  children,
  uuid,
}: PropsWithChildren & {
  uuid: string
}) {
  const { deletePagePermanent } = useTrashStore()
  const ref = useRef<HTMLButtonElement>(null)

  return (
    <Dialog modal>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="w-[90%] gap-0 rounded-xl p-0 md:max-w-sm" hideCloseButton>
        <DialogHeader className="p-4">
          <DialogDescription className="leading-1 text-left text-zinc-800 dark:text-zinc-100">
            Are you sure, do you want to permanently delete this page?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="w-full flex-row gap-0 border-t border-t-zinc-200 dark:border-t-zinc-600">
          <Button
            type="button"
            size="lg"
            variant="secondary"
            className="flex-1 rounded-none rounded-bl-xl text-red-500 dark:bg-zinc-800 dark:text-red-300"
            onClick={() => {
              deletePagePermanent(uuid)
              ref.current?.click()
            }}
          >
            Yes, delete
          </Button>
          <div className="!m-0 box-border h-full w-[1px] border-r border-r-zinc-200 p-0 dark:border-r-zinc-600" />
          <DialogClose asChild className="!m-0">
            <Button
              type="button"
              size="lg"
              className="flex-1 rounded-none rounded-br-xl dark:bg-zinc-800"
              variant="secondary"
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
