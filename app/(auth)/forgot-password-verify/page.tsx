"use client"

import FullScreenLoading from "@/components/full-screen-loading"
import { useAuthStore } from "@/store/use-auth-store"
import dynamic from "next/dynamic"
import { redirect } from "next/navigation"

const ForgotPasswordVerifyPage = dynamic(() => import("./forgot-password-verify"), {
  loading: () => <FullScreenLoading />,
  ssr: false,
})

export default function ForgotPasswordVerifyRootPage() {
  const { email } = useAuthStore()
  if (!email) return redirect("/forgot-password")

  return <ForgotPasswordVerifyPage />
}
