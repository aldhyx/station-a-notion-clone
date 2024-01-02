import { CheckCircle2Icon, LoaderIcon, XCircleIcon } from "lucide-react"
import { toast } from "sonner"

type Props = {
  title?: string
  description?: string | null
  id?: string | number
}

function toastError(props?: Props) {
  return toast.error(props?.title ?? "Failed", {
    id: props?.id,
    description: props?.description ?? "Something went wrong.",
    icon: <XCircleIcon size={16} />,
  })
}

function toastLoading(props?: Props) {
  return toast.loading(props?.title ?? "Loading", {
    id: props?.id,
    description: props?.description ?? "...",
    icon: <LoaderIcon size={16} className="animate-spin" />,
  })
}

function toastSuccess(props?: Props) {
  return toast.success(props?.title ?? "Success", {
    id: props?.id,
    description: props?.description,
    icon: <CheckCircle2Icon size={16} />,
  })
}

export { toastError, toastLoading, toastSuccess }
