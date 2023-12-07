"use client"

import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { PropsWithChildren, useState } from "react"
import RequestDialogContent from "./request-dialog-content"
import SuccessDialogContent from "./success-dialog-content"
import VerifyDialogContent from "./verify-dialog-content"

type Steps = "request" | "verify" | "success"
export default function ChangeEmailDialog({ children }: PropsWithChildren) {
  const [steps, setSteps] = useState<Steps>("request")
  const [newEmail, setNewEmail] = useState("")

  return (
    <Dialog
      onOpenChange={() => {
        setSteps("request")
        setNewEmail("")
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>

      {steps == "success" && <SuccessDialogContent />}

      {steps === "request" && (
        <RequestDialogContent
          nextSteps={() => setSteps("verify")}
          setNewEmail={setNewEmail}
        />
      )}

      {steps === "verify" && (
        <VerifyDialogContent
          prevSteps={() => setSteps("request")}
          nextSteps={() => setSteps("success")}
          newEmail={newEmail}
        />
      )}
    </Dialog>
  )
}
