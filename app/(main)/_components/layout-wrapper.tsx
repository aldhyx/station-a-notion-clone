"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useUserStore } from "@/store/use-user-store"
import { type User } from "@supabase/supabase-js"
import { ChevronsLeftIcon } from "lucide-react"
import { type PropsWithChildren } from "react"
import { useEffectOnce } from "usehooks-ts"
import { useLayoutWrapper } from "../_hooks/use-layout-wrapper"
import useSidebarRealtime from "../_hooks/use-sidebar-realtime"
import Header from "./header"
import SidebarMenu from "./sidebar-menu"
import SidebarTree from "./sidebar-tree"
import SidebarUser from "./sidebar-user"

export default function LayoutWrapper({
  children,
  currentUser,
}: PropsWithChildren & {
  currentUser: User
}) {
  const {
    mainRef,
    topbarRef,
    sidebarRef,
    isMobile,
    minimize,
    minimizeHandler,
    resizeHandler,
    maximizeHandler,
  } = useLayoutWrapper()

  const { setCurrentUser, getCurrentProfileUserAsync } = useUserStore()

  useEffectOnce(() => {
    setCurrentUser(currentUser)
    getCurrentProfileUserAsync()
  })

  useSidebarRealtime()

  return (
    <div className="relative flex min-h-screen select-none text-zinc-800">
      <aside
        data-state={minimize ? "closed" : "open"}
        ref={sidebarRef}
        className={cn(
          "group/sidebar relative z-[50] flex min-h-full flex-col overflow-y-auto bg-zinc-50 p-1 dark:bg-zinc-800",
          "data-[state=open]:w-60 data-[state=open]:animate-in data-[state=open]:fade-in-0",
          "data-[state=closed]:w-0 data-[state=closed]:p-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
          "!duration-300",
          isMobile && "fixed data-[state=open]:w-[75%]",
        )}
      >
        <SidebarUser />
        <SidebarMenu />
        <SidebarTree />

        <Button
          size="icon"
          className={cn(
            "absolute right-3 top-3 h-7 w-7 text-zinc-400 transition dark:text-zinc-300",
            isMobile ? "opacity-100" : "opacity-0 group-hover/sidebar:opacity-100",
          )}
          variant="ghost"
          onClick={minimizeHandler}
        >
          <ChevronsLeftIcon className="h-6 w-6" />
        </Button>

        {/* cursor area */}
        <div
          className={cn(
            "peer absolute right-0 top-0 z-[50] min-h-full w-[12px] cursor-col-resize",
            isMobile && "hidden",
          )}
          onMouseDown={resizeHandler}
          onClick={minimizeHandler}
        />

        {/* Resize line when hover on cursor area*/}
        <div className="absolute right-0 top-0 z-[49] min-h-full w-1 opacity-100 transition peer-hover:bg-zinc-200 dark:peer-hover:bg-zinc-600" />
      </aside>

      {/* mobile overlay backdrop */}
      <div
        data-state={minimize ? "closed" : "open"}
        className={cn(
          "fixed inset-0 right-0 top-0 z-10 bg-foreground/70 backdrop-blur-sm !duration-300 dark:bg-zinc-950/70",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0",
          "data-[state=closed]:hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
          !isMobile && "hidden",
        )}
        onClick={minimizeHandler}
      />

      <div
        data-state={minimize ? "closed" : "open"}
        ref={topbarRef}
        className={cn(
          "fixed right-0 top-0 bg-background !duration-300 dark:bg-zinc-900",
          "data-[state=open]:left-60 data-[state=open]:w-[calc(100vw-240px)] data-[state=open]:animate-in",
          "data-[state=closed]:left-0 data-[state=closed]:w-full data-[state=closed]:animate-out",
          isMobile && "!left-0 !w-full",
        )}
      >
        <Header
          minimize={minimize}
          isMobile={isMobile}
          maximizeHandler={maximizeHandler}
        />
      </div>

      <main
        className="mt-12 h-[calc(100vh-48px)] flex-1 overflow-y-auto bg-background duration-300 dark:bg-zinc-900"
        ref={mainRef}
      >
        {children}
      </main>
    </div>
  )
}
