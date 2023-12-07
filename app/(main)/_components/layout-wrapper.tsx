"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useUserStore } from "@/store/use-user-store"
import { type User } from "@supabase/supabase-js"
import { ChevronsLeftIcon } from "lucide-react"
import { type PropsWithChildren } from "react"
import { useEffectOnce } from "usehooks-ts"
import { useLayout } from "../_hooks/use-layout"
import Header from "./header"
import SidebarMenu from "./sidebar-menu"
import SidebarPages from "./sidebar-pages"
import SidebarUser from "./sidebar-user"

export default function LayoutWrapper({
  children,
  currentUser,
}: PropsWithChildren & {
  currentUser: User
}) {
  const {
    animating,
    isMobile,
    mainRef,
    minimize,
    minimizeHandler,
    resizeHandler,
    sidebarRef,
  } = useLayout()
  const { setCurrentUser, getCurrentProfileUserAsync } = useUserStore()

  useEffectOnce(() => {
    setCurrentUser(currentUser)
    getCurrentProfileUserAsync()
  })

  return (
    <div className="relative flex min-h-screen select-none text-zinc-800">
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar relative z-[50] flex min-h-full w-60 flex-col overflow-y-auto bg-zinc-100 p-1",
          animating && "transition-all duration-200 ease-in-out",
          minimize && "p-0",
          isMobile && "w-0 p-0",
        )}
      >
        <SidebarUser />
        <SidebarMenu />
        <SidebarPages />

        <Button
          size="icon"
          className={cn(
            "absolute right-3 top-3 h-7 w-7 text-zinc-600 transition",
            isMobile ? "opacity-100" : "opacity-0 group-hover/sidebar:opacity-100",
          )}
          variant="ghost"
          onClick={minimizeHandler}
        >
          <ChevronsLeftIcon className="h-6 w-6" />
        </Button>

        {/* cursor area */}
        <div
          className="peer absolute right-0 top-0 z-[50] min-h-full w-[12px] cursor-col-resize"
          onMouseDown={resizeHandler}
          onClick={minimizeHandler}
        />
        {/* Resize line when hover on cursor area*/}
        <div className="absolute right-0 top-0 z-[49] min-h-full w-1 opacity-100 shadow-[rgba(0,0,0,0.028)_-1px_0px_0px_0px_inset] peer-hover:shadow-[rgba(0,0,0,0.1)_-2px_0px_0px_0px_inset]" />
      </aside>

      <Header />

      <main
        className={"mt-12 h-[calc(100vh-48px)] flex-1 overflow-y-auto bg-background"}
        ref={mainRef}
      >
        {children}
      </main>
    </div>
  )
}
