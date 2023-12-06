import { getErrorMessage } from "@/helper/error.helper"
import { client } from "@/lib/supabase/client"

type Props = {
  email: string
  token: string
}

export const signUpVerifyAsync = async ({ email, token }: Props) => {
  try {
    const { data, error } = await client.auth.verifyOtp({
      email,
      token,
      type: "email",
    })

    if (!error) return { data, error: null }

    // rate limit error
    if (error.status === 429) throw new Error("")
    throw new Error(error.message)
  } catch (error) {
    return Promise.resolve({
      data: null,
      error: { message: getErrorMessage(error as Error) },
    })
  }
}

export const resendOtpAsync = async (email: string) => {
  try {
    const { error, data } = await client.auth.resend({ type: "signup", email })

    if (error) {
      // rate limit error
      if (error.status === 429) throw new Error("")
      throw new Error(error.message)
    }

    return { data, error }
  } catch (error) {
    return Promise.resolve({
      data: null,
      error: { message: getErrorMessage(error as Error) },
    })
  }
}
