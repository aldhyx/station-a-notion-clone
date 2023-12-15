"use client"

import FullScreenLoading from "@/components/full-screen-loading"
import dynamic from "next/dynamic"
import { redirect, useSearchParams } from "next/navigation"
import { emailSchema } from "./_schema"

const ForgotPasswordVerifyPage = dynamic(() => import("./forgot-password-verify"), {
  loading: () => <FullScreenLoading />,
  ssr: false,
})

export default function ForgotPasswordVerifyRootPage() {
  const params = useSearchParams()
  const mailto = params.get("mailto")
  const email = emailSchema.safeParse(mailto)

  if (!email.success) return redirect("/forgot-password")

  return <ForgotPasswordVerifyPage />
}
