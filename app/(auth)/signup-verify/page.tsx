"use client"

import FullScreenLoading from "@/components/full-screen-loading"
import dynamic from "next/dynamic"
import { redirect, useSearchParams } from "next/navigation"
import { emailSchema } from "./_schema"

const SignUpVerifyPage = dynamic(() => import("./signup-verify"), {
  ssr: false,
  loading: () => <FullScreenLoading />,
})

export default function SignUpVerifyRootPage() {
  const params = useSearchParams()
  const mailto = params.get("mailto")
  const email = emailSchema.safeParse(mailto)

  if (!email.success) return redirect("/signup")

  return <SignUpVerifyPage />
}
