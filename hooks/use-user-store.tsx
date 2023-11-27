import { User } from "@supabase/supabase-js"
import { create } from "zustand"

type SetProfileProps = {
  username: string | null
  fullname: string | null
}

type UserStore = {
  currentUser: User | null
  username: string | null
  fullname: string | null
  setCurrentUser: (user: User) => void
  setProfile: ({ username, fullname }: SetProfileProps) => void
}

export const useUserStore = create<UserStore>(set => ({
  currentUser: null,
  loading: false,
  fullname: null,
  username: null,
  setCurrentUser: user => set({ currentUser: user }),
  setProfile: ({ username, fullname }: SetProfileProps) => set({ username, fullname }),
}))
