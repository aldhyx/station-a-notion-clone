"use client"

import FullScreenLoading from "@/components/full-screen-loading"
import dynamic from "next/dynamic"

const LoginPage = dynamic(() => import("./login"), {
  loading: () => <FullScreenLoading />,
  ssr: false,
})

export default function LoginRootPage() {
  return <LoginPage />
}
