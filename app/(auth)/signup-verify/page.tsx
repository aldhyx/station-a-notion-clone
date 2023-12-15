"use client"

import FullScreenLoading from "@/components/full-screen-loading"
import { useAuthStore } from "@/store/use-auth-store"
import dynamic from "next/dynamic"

const SignUpVerifyPage = dynamic(() => import("./signup-verify"), {
  ssr: false,
  loading: () => <FullScreenLoading />,
})

export default function SignUpVerifyRootPage() {
  const { email } = useAuthStore()
  // debug
  console.log(email)
  // if (!email) return redirect("/signup")

  return <SignUpVerifyPage />
}
