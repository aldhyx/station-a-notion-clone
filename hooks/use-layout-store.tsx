import { create } from "zustand"

type LayoutStore = {
  minimize: boolean
  animating: boolean
  minSidebarWidth: 240
  maxSidebarWidth: 480
  manualMinimizeTriggered?: "settings"
  setMinimize: (v: boolean) => void
  setAnimating: (v: boolean) => void
  triggerManualMinimize: (v?: "settings") => void
}

export const useLayoutStore = create<LayoutStore>(set => ({
  minimize: false,
  animating: false,
  minSidebarWidth: 240,
  maxSidebarWidth: 480,
  setMinimize: v => set({ minimize: v }),
  setAnimating: v => set({ animating: v }),
  triggerManualMinimize: v => set({ manualMinimizeTriggered: v }),
}))
