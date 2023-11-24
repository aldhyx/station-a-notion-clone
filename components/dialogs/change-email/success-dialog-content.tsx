import { DialogContent } from "@/components/ui/dialog"
import { PartyPopperIcon } from "lucide-react"

export default function SuccessDialogContent() {
  return (
    <DialogContent className="top-[5%] max-w-sm translate-y-[0] gap-0 px-4 pb-10 pt-14">
      <div className="flex w-full flex-col items-center justify-center">
        <PartyPopperIcon className="mb-8 h-20 w-20" />
        <h1 className="mb-2 text-3xl font-bold md:text-4xl">Success</h1>
        <p className="w-full text-center text-sm">Email has been changed successfully.</p>
      </div>
    </DialogContent>
  )
}
