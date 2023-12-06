import { getErrorMessage } from "@/helper/error.helper"
import { client } from "@/lib/supabase/client"

export const requestResetPasswordAsync = async (email: string) => {
  try {
    const { error, data } = await client.auth.resetPasswordForEmail(email)

    if (!error) {
      return { data, error: null }
    }

    throw new Error(error.message)
  } catch (error) {
    return Promise.resolve({
      data: null,
      error: {
        message: getErrorMessage(error as Error),
      },
    })
  }
}
