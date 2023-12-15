import FullScreenLoading from "@/components/full-screen-loading"
import dynamic from "next/dynamic"

const ForgotPasswordPage = dynamic(() => import("./forgot-password"), {
  loading: () => <FullScreenLoading />,
  ssr: false,
})

export default function ForgotPasswordRootPage() {
  return <ForgotPasswordPage />
}
