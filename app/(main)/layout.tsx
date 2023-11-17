"use client"
import ButtonHoverTooltip from "@/components/button-hover-tooltip"
import { Button } from "@/components/ui/button"
import { useLayoutStore } from "@/hooks/use-layout-store"
import { cn } from "@/lib/utils"
import { ChevronsLeftIcon, ChevronsRightIcon, MenuIcon } from "lucide-react"
import React, { useEffect, useRef, useState } from "react"
import { useMediaQuery } from "usehooks-ts"
import HeaderItems from "./docs/_components/header"
import SidebarNewPage from "./docs/_components/sidebar-new-page"
import SidebarSearch from "./docs/_components/sidebar-search"
import SidebarSettings from "./docs/_components/sidebar-settings"
import SidebarTrash from "./docs/_components/sidebar-trash"
import SidebarUser from "./docs/_components/sidebar-user"

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [mount, setMount] = useState(false)

  const isResizingRef = useRef(false)
  const sidebarRef = useRef<React.ElementRef<"aside">>(null)
  const topbarRef = useRef<React.ElementRef<"div">>(null)
  const mainRef = useRef<React.ElementRef<"main">>(null)

  const isMobile = useMediaQuery("(max-width: 468px)")

  const {
    animating,
    minimize,
    setAnimating,
    setMinimize,
    maxSidebarWidth,
    minSidebarWidth,
  } = useLayoutStore()

  const mouseMoveHandler = (e: MouseEvent) => {
    if (!isResizingRef.current) return

    if (sidebarRef.current && topbarRef.current) {
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

      sidebarRef.current.style.width = isMobile ? "100%" : "240px"
      topbarRef.current.style.width = isMobile ? "0" : `calc(100vw - 240px)`
      topbarRef.current.style.left = ""
      mainRef.current.style.width = isMobile ? "0" : ""

      setMinimize(false)
      setTimeout(() => setAnimating(false), 200)
    }
  }

  const minimizeHandler = () => {
    if (sidebarRef.current && topbarRef.current && mainRef.current) {
      setAnimating(true)

      sidebarRef.current.style.width = "0"
      topbarRef.current.style.width = "100%"
      topbarRef.current.style.left = "0"
      mainRef.current.style.width = ""

      setMinimize(true)
      setTimeout(() => setAnimating(false), 200)
    }
  }

  useEffect(() => {
    isMobile ? maximizeHandler() : minimizeHandler()
  }, [isMobile])

  useEffect(() => setMount(true), [])
  if (!mount) return null

  return (
    <div className="relative flex min-h-screen select-none overflow-x-hidden text-zinc-900">
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar relative z-[50] box-border flex min-h-full w-60 flex-col overflow-y-auto bg-zinc-100",
          animating && "transition-all duration-200 ease-in-out",
          isMobile && "w-0",
          !minimize && "p-1",
        )}
      >
        <SidebarUser />
        <SidebarSearch />
        <SidebarSettings />
        <SidebarTrash />
        <SidebarNewPage />

        <ButtonHoverTooltip text="Close sidebar" asChild>
          <Button
            size="icon"
            className={cn(
              "absolute right-3 top-3 h-7 w-7 opacity-0 transition group-hover/sidebar:opacity-100",
              isMobile && "opacity-100",
            )}
            variant="ghost"
            onClick={minimizeHandler}
          >
            <ChevronsLeftIcon className="h-6 w-6" />
          </Button>
        </ButtonHoverTooltip>
        {/* cursor area */}
        <div
          className="peer absolute right-0 top-0 z-[50] min-h-full w-[12px] cursor-col-resize"
          onMouseDown={resizeHandler}
          onClick={minimizeHandler}
        />
        {/* Resize line when hover on cursor area*/}
        <div className="absolute right-0 top-0 z-[49] min-h-full w-1 opacity-100 shadow-[rgba(0,0,0,0.028)_-1px_0px_0px_0px_inset] peer-hover:shadow-[rgba(0,0,0,0.1)_-2px_0px_0px_0px_inset]" />
      </aside>

      <div
        ref={topbarRef}
        className={cn(
          "fixed left-60 right-0 top-0 ml-auto w-[calc(100vw-240px)] bg-zinc-50",
          animating && "transition-all duration-200 ease-in-out",
          isMobile && "left-0 w-full",
        )}
      >
        <header className="flex h-12 items-center justify-start border-b border-zinc-200 px-3">
          <ButtonHoverTooltip text="Open sidebar" asChild>
            <Button
              size="icon"
              variant="ghost"
              className={cn(
                "group/collapse relative h-7 w-7",
                !minimize && !isMobile && "hidden",
              )}
              onClick={maximizeHandler}
            >
              <MenuIcon className="absolute h-6 w-6 transition-[opacity] duration-200 group-hover/collapse:opacity-0" />
              <ChevronsRightIcon className="absolute h-6 w-6 opacity-0 transition-[opacity] duration-200 group-hover/collapse:opacity-100" />
            </Button>
          </ButtonHoverTooltip>

          <HeaderItems />
        </header>
      </div>

      <main className="mt-12 min-h-[calc(100vh-48px)] flex-1 bg-zinc-50 " ref={mainRef}>
        {children}
      </main>
    </div>
  )
}

export default MainLayout
