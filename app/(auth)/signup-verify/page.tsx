"use client"

import FullScreenLoading from "@/components/full-screen-loading"
import { useAuthStore } from "@/hook/store/use-auth-store"
import dynamic from "next/dynamic"
import { redirect } from "next/navigation"

const SignUpVerifyPage = dynamic(() => import("./signup-verify"), {
  ssr: false,
  loading: () => <FullScreenLoading />,
})

export default function SignUpVerifyRootPage() {
  const { email } = useAuthStore()
  if (!email) return redirect("/signup")

  return <SignUpVerifyPage />
}
