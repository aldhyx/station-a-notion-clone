"use client"

import { useDocStore } from "@/store/use-doc-store"
import { useRouter } from "next/navigation"
import { PropsWithChildren, useRef } from "react"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog"

type Props = PropsWithChildren & {
  uuid: string
}

export default function MoveToTrashDialog({ children, uuid }: Props) {
  const router = useRouter()
  const ref = useRef<HTMLButtonElement>(null)
  const { deleteDocAsync } = useDocStore()

  const deleteDocHandler = async () => {
    ref.current?.click()
    const res = await deleteDocAsync(uuid)
    if (res.uuid) router.push(`/doc`)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="w-[90%] gap-0 rounded-xl p-0 md:max-w-sm" hideCloseButton>
        <DialogHeader className="p-4">
          <DialogDescription className="leading-1 text-left text-zinc-800">
            Are you sure, do you want to move this page to trash?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="w-full flex-row gap-0 border-t border-zinc-200">
          <Button
            type="button"
            size="lg"
            variant="secondary"
            className="flex-1 rounded-none rounded-bl-xl"
            onClick={deleteDocHandler}
          >
            Yes, move to trash
          </Button>
          <div className="!m-0 box-border h-full w-[1px] border-r border-zinc-200 p-0" />
          <DialogClose asChild className="!m-0">
            <Button
              type="button"
              size="lg"
              className="flex-1 rounded-none rounded-br-xl"
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
