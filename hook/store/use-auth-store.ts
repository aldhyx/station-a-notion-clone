import { Dispatch, SetStateAction, useState } from "react"
import { create } from "zustand"

type AuthStore = {
  email: string | null
  setEmail: (email: string | null) => void
}

export const useAuthStore = create<AuthStore>()(set => ({
  email: null,
  setEmail(email) {
    set({ email })
  },
}))
