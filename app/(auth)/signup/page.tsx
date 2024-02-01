import FullScreenLoading from "@/components/full-screen-loading"
import dynamic from "next/dynamic"

const SignUpPage = dynamic(() => import("./signup"), {
  loading: () => <FullScreenLoading />,
})

export default function SignUpRootPage() {
  return <SignUpPage />
}
