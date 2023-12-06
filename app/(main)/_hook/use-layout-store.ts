import { create } from "zustand"

type ManualMinimizeTriggered = "settings" | "trash" | "page"
type LayoutState = {
  minimize: boolean
  animating: boolean
  minSidebarWidth: 240
  maxSidebarWidth: 480
  manualMinimizeTriggered?: ManualMinimizeTriggered
}

type LayoutAction = {
  setMinimize: (v: boolean) => void
  setAnimating: (v: boolean) => void
  triggerManualMinimize: (v?: ManualMinimizeTriggered) => void
}

export const useLayoutStore = create<LayoutState & LayoutAction>()(set => ({
  minimize: false,
  animating: false,
  minSidebarWidth: 240,
  maxSidebarWidth: 480,
  setMinimize: v => set({ minimize: v }),
  setAnimating: v => set({ animating: v }),
  triggerManualMinimize: v => set({ manualMinimizeTriggered: v }),
}))
