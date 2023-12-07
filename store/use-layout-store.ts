import { create } from "zustand"

type MinimizeTriggered = "settings" | "trash" | "doc"
type LayoutState = {
  minimize: boolean
  animating: boolean
  minSidebarWidth: 240
  maxSidebarWidth: 480
  minimizeTriggered?: MinimizeTriggered
}

type LayoutAction = {
  setMinimize: (v: boolean) => void
  setAnimating: (v: boolean) => void
  triggerMinimize: (v?: MinimizeTriggered) => void
}

export const useLayoutStore = create<LayoutState & LayoutAction>()(set => ({
  minimize: false,
  animating: false,
  minSidebarWidth: 240,
  maxSidebarWidth: 480,
  setMinimize: v => set({ minimize: v }),
  setAnimating: v => set({ animating: v }),
  triggerMinimize: v => set({ minimizeTriggered: v }),
}))
