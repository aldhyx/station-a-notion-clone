import { getErrorMessage } from "@/helper/error.helper"
import { toast } from "sonner"

function toastError({ message, id }: { message: string; id?: string | number }): void
function toastError({ error, id }: { error: Error; id?: string | number }): void

function toastError({
  error,
  id,
  message,
}: {
  message?: string
  error?: Error
  id?: string | number
}) {
  if (error instanceof Error) toast.error(getErrorMessage(error), { id })
  else if (message) toast.error(message, { id })
  else throw new Error("Invalid options")
}

function toastLoading({ message, id }: { message: string; id?: string | number }) {
  toast.loading(message, { id })
}

function toastSuccess({ message, id }: { message: string; id?: string | number }) {
  toast.success(message, { id })
}

export { toastError, toastLoading, toastSuccess }
