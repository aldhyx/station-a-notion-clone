import { getErrorMessage } from "@/helper/error.helper"
import { client } from "@/lib/supabase/client"

export const updatePasswordAsync = async (password: string) => {
  try {
    const { data, error } = await client.auth.updateUser({ password })

    if (error) throw new Error(error.message)
    return { data, error: null }
  } catch (error) {
    return Promise.resolve({
      data: null,
      error: {
        message: getErrorMessage(error as Error),
      },
    })
  }
}
