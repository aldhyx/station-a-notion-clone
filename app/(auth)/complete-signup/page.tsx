import React from "react"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import FullScreenLoading from "@/components/full-screen-loading"
import dynamic from "next/dynamic"

const CompleteSignUpPage = dynamic(() => import("./complete-signup"), {
  loading: () => <FullScreenLoading />,
  ssr: false,
})

export default async function CompleteSignUpRootPage() {
  const cookiesStore = cookies()
  const server = createClient(cookiesStore)

  const { data: profile } = await server
    .from("profiles")
    .select("username, fullname")
    .single()

  if (profile?.fullname && profile?.username) return redirect("/doc")

  return <CompleteSignUpPage />
}
