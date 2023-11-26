import { User } from "@supabase/supabase-js"
import { create } from "zustand"

type UserStore = {
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
}

export const useUserStore = create<UserStore>(set => ({
  currentUser: null,
  loading: false,
  setCurrentUser: user => set({ currentUser: user }),
}))
