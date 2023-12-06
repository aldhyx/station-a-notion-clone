import { useEffect, useRef } from "react"
import { useMediaQuery } from "usehooks-ts"
import { useLayoutStore } from "./use-layout-store"

export const useLayout = () => {
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

  const isResizingRef = useRef(false)
  const sidebarRef = useRef<React.ElementRef<"aside">>(null)
  const topbarRef = useRef<React.ElementRef<"div">>(null)
  const mainRef = useRef<React.ElementRef<"main">>(null)

  const isMobile = useMediaQuery("(max-width: 468px)")

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

  return {
    sidebarRef,
    mainRef,
    topbarRef,
    animating,
    minimize,
    isMobile,

    maximizeHandler,
    minimizeHandler,
    resizeHandler,
  }
}
