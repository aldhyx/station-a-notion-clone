"use client"

import FullScreenLoading from "@/components/full-screen-loading"
import dynamic from "next/dynamic"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const ForgotPasswordPage = dynamic(() => import("./forgot-password"), {
  ssr: false,
  loading: () => <FullScreenLoading />,
})

const ForgotPasswordVerificationPage = dynamic(
  () => import("./forgot-password-verification"),
  {
    ssr: false,
    loading: () => <FullScreenLoading />,
  },
)

export default function ForgotPassword() {
  const params = useSearchParams()
  const steps = Number(params.get("steps")) || 1

  const [email, setEmail] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (steps === 1) setEmail(undefined)
  }, [steps])

  return (
    <>
      {steps === 1 ? (
        <ForgotPasswordPage setEmail={setEmail} />
      ) : (
        <ForgotPasswordVerificationPage email={email} />
      )}
    </>
  )
}
