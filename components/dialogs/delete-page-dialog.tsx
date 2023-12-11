"use client"

import { useDocStore } from "@/store/use-doc-store"
import { LoaderIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { Dispatch, PropsWithChildren, SetStateAction, useState } from "react"
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
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export default function DeletePageDialog({ children, uuid, open, setOpen }: Props) {
  const router = useRouter()
  const { deleteDocAsync } = useDocStore()
  const [loading, setLoading] = useState(false)

  const deleteDocHandler = async () => {
    setLoading(true)
    const res = await deleteDocAsync(uuid)
    setLoading(false)
    setOpen(false)

    if (res.uuid) router.push(`/doc`)
  }

  return (
    <Dialog defaultOpen={open}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        className="w-[90%] gap-0 rounded-xl p-0 md:max-w-sm"
        hideCloseButton
        onInteractOutside={() => {
          if (loading) return
          setOpen(false)
        }}
      >
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
            disabled={loading}
          >
            {loading ? (
              <LoaderIcon className="h-4 w-4 animate-spin" />
            ) : (
              "Yes, move to trash"
            )}
          </Button>
          <div className="!m-0 box-border h-full w-[1px] border-r border-zinc-200 p-0" />
          <DialogClose asChild className="!m-0">
            <Button
              type="button"
              size="lg"
              className="flex-1 rounded-none rounded-br-xl"
              variant="secondary"
              disabled={loading}
              onClick={() => setOpen(false)}
            >
              No
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
