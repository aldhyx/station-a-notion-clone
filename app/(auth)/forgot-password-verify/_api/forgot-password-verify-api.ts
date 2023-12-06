import { getErrorMessage } from "@/helper/error.helper"
import { client } from "@/lib/supabase/client"

export const verifyForResetPasswordAsync = async ({
  email,
  token,
}: {
  email: string
  token: string
}) => {
  try {
    const { data, error } = await client.auth.verifyOtp({
      email,
      token,
      type: "recovery",
    })

    if (error) {
      // rate limit error
      if (error.status === 429) throw new Error("")
      throw new Error(error.message)
    }

    return { data, error: null }
  } catch (error) {
    return Promise.resolve({
      data: null,
      error: { message: getErrorMessage(error as Error) },
    })
  }
}
