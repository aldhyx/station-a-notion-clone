import FullScreenLoading from "@/components/full-screen-loading"
import dynamic from "next/dynamic"

const ResetPasswordPage = dynamic(() => import("./reset-password"), {
  ssr: false,
  loading: () => <FullScreenLoading />,
})

export default function ResetPasswordRootPage() {
  return <ResetPasswordPage />
}
