import { client } from "@/lib/supabase/client"
import { toastError, toastLoading, toastSuccess } from "@/lib/toast"
import { SignOut, type User } from "@supabase/supabase-js"
import { toast } from "sonner"
import { create } from "zustand"

type UserState = {
  currentUser: User | null
  username: string | null
  fullname: string | null
}
type UserAction = {
  setCurrentUser: (user: User) => void
  setProfile: (options: { username: string | null; fullname: string | null }) => void
  signOutAsync: (scope?: SignOut["scope"]) => Promise<void>
  reset: () => void
  getCurrentUserAsync: () => void
}

const initialState: UserState = {
  currentUser: null,
  fullname: null,
  username: null,
}

export const useUserStore = create<UserState & UserAction>()(set => ({
  ...initialState,
  reset() {
    set(initialState)
  },
  setCurrentUser: user => set({ currentUser: user }),
  setProfile: ({ username, fullname }) => set({ username, fullname }),
  async getCurrentUserAsync() {
    const id = toast("getCurrentUser")
    try {
      const { data, error } = await client.auth.getUser()
      if (error) throw new Error(error.message)
      set({ currentUser: data.user })

      const { data: pData } = await client.from("profiles").select(`username, fullname`)

      set({
        fullname: pData?.length ? pData[0]?.fullname : null,
        username: pData?.length ? pData[0]?.username : null,
      })
    } catch (error) {
      toastError({
        message: '"Something went wrong. Please reload or try login again.',
        id,
      })
    }
  },
  async signOutAsync(scope = "local") {
    const message = {
      success: {
        local: "Successfully logged out.",
        global: "Successfully logged out all device",
        others: "Successfully logged out other device",
      },
      error: {
        local: "Something went wrong! Failed to log out",
        global: "Something went wrong! Failed to log out all device",
        others: "Something went wrong! Failed to log out other device",
      },
    }

    const id = toast("signOut")
    toastLoading({ message: "Logging out...", id })

    try {
      const { error } = await client.auth.signOut({ scope })
      if (error) throw new Error(error.message)
      toastSuccess({ message: message.success[scope], id })
    } catch (error) {
      toastError({ message: message.error[scope], id })
    }
  },
}))
