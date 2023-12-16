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
import { useDocStore } from "@/store/use-doc-store"
import { useRouter } from "next/navigation"
import { PropsWithChildren, useRef } from "react"

type Props = PropsWithChildren & {
  uuid: string
}

export default function MoveToTrashDialog({ children, uuid }: Props) {
  const router = useRouter()
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const { deleteDocAsync } = useDocStore()

  const deleteDocHandler = async () => {
    closeButtonRef.current?.click()
    const res = await deleteDocAsync(uuid)
    if (res.uuid) router.push(`/doc`)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="w-[90%] gap-0 rounded-xl p-0 md:max-w-sm" hideCloseButton>
        <DialogHeader className="p-4">
          <DialogDescription className="leading-1 text-left text-zinc-800 dark:text-zinc-100">
            Are you sure, do you want to move this page to trash?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="w-full flex-row gap-0 border-t border-t-zinc-200 dark:border-t-zinc-600">
          <Button
            type="button"
            size="lg"
            variant="secondary"
            className="flex-1 rounded-none rounded-bl-xl text-red-500 dark:bg-zinc-800 dark:text-red-300"
            onClick={deleteDocHandler}
          >
            Yes, move to trash
          </Button>
          <div className="!m-0 box-border h-full w-[1px] border-r border-r-zinc-200 p-0 dark:border-r-zinc-600" />
          <DialogClose asChild className="!m-0">
            <Button
              type="button"
              size="lg"
              className="flex-1 rounded-none rounded-br-xl dark:bg-zinc-800"
              variant="secondary"
              ref={closeButtonRef}
            >
              No
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
