"use client"

import { Dialog, DialogClose, DialogTrigger } from "@/components/ui/dialog"
import { PropsWithChildren, useRef, useState } from "react"
import RequestDialogContent from "./request-dialog-content"
import VerifyDialogContent from "./verify-dialog-content"

type Steps = "request" | "verify"
export default function ChangeEmailDialog({ children }: PropsWithChildren) {
  const [steps, setSteps] = useState<Steps>("request")
  const [newEmail, setNewEmail] = useState("")
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)

  return (
    <Dialog
      onOpenChange={() => {
        setSteps("request")
        setNewEmail("")
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>

      {steps === "request" && (
        <RequestDialogContent
          nextSteps={() => setSteps("verify")}
          setNewEmail={setNewEmail}
        />
      )}

      {steps === "verify" && (
        <VerifyDialogContent
          prevSteps={() => setSteps("request")}
          nextSteps={() => closeButtonRef.current?.click()}
          newEmail={newEmail}
        />
      )}

      <DialogClose hidden>
        <button type="button" ref={closeButtonRef}>
          close
        </button>
      </DialogClose>
    </Dialog>
  )
}
