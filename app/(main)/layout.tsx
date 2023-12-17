import { PropsWithChildren } from "react"

import FullScreenLoading from "@/components/full-screen-loading"
import { ThemeProvider } from "@/components/providers/theme.provider"
import { createClient } from "@/lib/supabase/server"
import dynamic from "next/dynamic"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const LayoutWrapper = dynamic(() => import("./_components/layout-wrapper"), {
  ssr: false,
  loading: () => <FullScreenLoading />,
})

export default async function MainLayout({ children }: PropsWithChildren) {
  const cookiesStore = cookies()
  const server = createClient(cookiesStore)

  const {
    data: { user },
  } = await server.auth.getUser()
  if (!user) return redirect("/")

  return (
    <LayoutWrapper currentUser={user}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
        storageKey="station-theme"
      >
        {children}
      </ThemeProvider>
    </LayoutWrapper>
  )
}
