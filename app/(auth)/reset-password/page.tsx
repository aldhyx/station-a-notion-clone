import FullScreenLoading from "@/components/full-screen-loading"
import dynamic from "next/dynamic"

const ResetPasswordPage = dynamic(() => import("./reset-password"), {
  loading: () => <FullScreenLoading />,
  ssr: false,
})

export default function ResetPasswordRootPage() {
  return <ResetPasswordPage />
}
