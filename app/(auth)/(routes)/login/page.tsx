"use client"

import FullScreenLoading from "@/components/full-screen-loading"
import dynamic from "next/dynamic"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const LoginPage = dynamic(() => import("./login"), {
  ssr: false,
  loading: () => <FullScreenLoading />,
})

const SignUpVerificationPage = dynamic(() => import("../signup/signup-verification"), {
  ssr: false,
  loading: () => <FullScreenLoading />,
})

export default function Login() {
  const params = useSearchParams()
  const steps = Number(params.get("steps")) || 1

  const [email, setEmail] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (steps === 1) setEmail(undefined)
  }, [steps])

  return (
    <>
      {steps === 1 ? (
        <LoginPage setEmail={setEmail} />
      ) : (
        <SignUpVerificationPage email={email} />
      )}
    </>
  )
}
