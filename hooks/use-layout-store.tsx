import { create } from "zustand"

type ManualMinimizeTriggered = "settings" | "trash"
type LayoutStore = {
  minimize: boolean
  animating: boolean
  minSidebarWidth: 240
  maxSidebarWidth: 480
  manualMinimizeTriggered?: ManualMinimizeTriggered
  setMinimize: (v: boolean) => void
  setAnimating: (v: boolean) => void
  triggerManualMinimize: (v?: ManualMinimizeTriggered) => void
}

export const useLayoutStore = create<LayoutStore>()(set => ({
  minimize: false,
  animating: false,
  minSidebarWidth: 240,
  maxSidebarWidth: 480,
  setMinimize: v => set({ minimize: v }),
  setAnimating: v => set({ animating: v }),
  triggerManualMinimize: v => set({ manualMinimizeTriggered: v }),
}))
