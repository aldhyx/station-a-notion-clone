"use client"

import { Button } from "@/components/ui/button"
import { useLayoutStore } from "@/hooks/use-layout-store"
import { useUserStore } from "@/hooks/use-user-store"
import { supabase } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { ChevronsLeftIcon, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, type PropsWithChildren } from "react"
import { toast } from "sonner"
import { useEffectOnce, useMediaQuery } from "usehooks-ts"
import Header from "./header"
import SidebarMenu from "./sidebar-menu"
import SidebarPages from "./sidebar-pages"
import SidebarUser from "./sidebar-user"

export default function LayoutWrapper({ children }: PropsWithChildren) {
  const isResizingRef = useRef(false)
  const sidebarRef = useRef<React.ElementRef<"aside">>(null)
  const topbarRef = useRef<React.ElementRef<"div">>(null)
  const mainRef = useRef<React.ElementRef<"main">>(null)

  const isMobile = useMediaQuery("(max-width: 468px)")
  const { setCurrentUser, setProfile } = useUserStore()
  const router = useRouter()

  const {
    animating,
    minimize,
    setAnimating,
    setMinimize,
    maxSidebarWidth,
    minSidebarWidth,
    manualMinimizeTriggered,
    triggerManualMinimize,
  } = useLayoutStore()

  const mouseMoveHandler = (e: MouseEvent) => {
    if (sidebarRef.current && topbarRef.current && isResizingRef.current) {
      let newWidth = e.clientX

      if (newWidth <= minSidebarWidth) newWidth = minSidebarWidth
      if (newWidth >= maxSidebarWidth) newWidth = maxSidebarWidth

      sidebarRef.current.style.setProperty("width", `${newWidth}px`)
      topbarRef.current.style.left = `${newWidth}px`
      topbarRef.current.style.width = `calc(100vw - ${newWidth}px)`
    }
  }

  const mouseUpHandler = () => {
    isResizingRef.current = false
    document.removeEventListener("mousemove", mouseMoveHandler)
    document.removeEventListener("mouseup", mouseUpHandler)
  }

  const resizeHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    isResizingRef.current = true
    document.addEventListener("mousemove", mouseMoveHandler)
    document.addEventListener("mouseup", mouseUpHandler)
  }

  const maximizeHandler = () => {
    if (sidebarRef.current && topbarRef.current && mainRef.current) {
      setAnimating(true)

      sidebarRef.current.style.width = isMobile ? "100vw" : `${minSidebarWidth}px`
      topbarRef.current.style.width = `calc(100vw - ${minSidebarWidth}px)`
      topbarRef.current.style.left = `${minSidebarWidth}px`
      mainRef.current.style.width = `calc(100vw - ${minSidebarWidth}px)`

      setMinimize(false)
      setTimeout(() => setAnimating(false), 200)
    }
  }

  const minimizeHandler = () => {
    if (sidebarRef.current && topbarRef.current && mainRef.current) {
      setAnimating(true)

      sidebarRef.current.style.width = "0"
      topbarRef.current.style.width = "100vw"
      topbarRef.current.style.left = "0"
      mainRef.current.style.width = "100vw"

      setMinimize(true)
      setTimeout(() => setAnimating(false), 200)
    }
  }

  useEffect(() => {
    if (isMobile) minimizeHandler()
    else if (minimize) maximizeHandler()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile])

  useEffect(() => {
    if (isMobile && manualMinimizeTriggered) {
      minimizeHandler()
      triggerManualMinimize()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, manualMinimizeTriggered])

  const getCurrentUser = async () => {
    try {
      const { data, error } = await supabase.auth.getUser()
      if (error) throw new Error(error.message)
      setCurrentUser(data.user)

      const { data: pData } = await supabase.from("profiles").select(`username, fullname`)

      setProfile({
        fullname: pData?.length ? pData[0]?.fullname : null,
        username: pData?.length ? pData[0]?.username : null,
      })
    } catch (error) {
      toast.error("Something went wrong. Please reload or try login again.", {
        icon: <XCircle className="h-5 w-5 text-zinc-50" />,
        classNames: {
          toast: "!bg-red-500 !border-red-500",
          title: "!text-zinc-50",
        },

        duration: 6000,
      })

      router.replace("/login")
    }
  }

  useEffectOnce(() => {
    getCurrentUser()
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
      <Header ref={topbarRef} maximizeHandler={maximizeHandler} isMobile={isMobile} />
      <main
        className={"mt-12 h-[calc(100vh-48px)] flex-1 overflow-y-auto bg-zinc-50"}
        ref={mainRef}
      >
        {children}
      </main>
    </div>
  )
}
