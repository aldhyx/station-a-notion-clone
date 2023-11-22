"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import dynamic from "next/dynamic"
import FullScreenLoading from "../../../../components/full-screen-loading"

const SignUpPage = dynamic(() => import("./signup"), {
  ssr: false,
  loading: () => <FullScreenLoading />,
})

const SignUpVerificationPage = dynamic(() => import("./signup-verification"), {
  ssr: false,
  loading: () => <FullScreenLoading />,
})

export default function SignUp() {
  const params = useSearchParams()
  const steps = Number(params.get("steps")) || 1

  const [email, setEmail] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (steps === 1) setEmail(undefined)
  }, [steps])

  return (
    <>
      {steps === 1 ? (
        <SignUpPage setEmail={setEmail} />
      ) : (
        <SignUpVerificationPage email={email} />
      )}
    </>
  )
}
