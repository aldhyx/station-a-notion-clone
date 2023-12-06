import { getErrorMessage } from "@/helper/error.helper"
import { client } from "@/lib/supabase/client"

type Props = {
  email: string
  password: string
}

export const signInWithPasswordAsync = async (props: Props) => {
  try {
    const { data, error } = await client.auth.signInWithPassword(props)

    if (!error) {
      return { data, error: null }
    }

    const isNeedConfirmEmail = error.message.toLowerCase() === "email not confirmed"

    if (isNeedConfirmEmail) throw new Error("NEED_CONFIRM_EMAIL")
    else {
      throw new Error(error.status === 400 ? "Invalid email or password" : error.message)
    }
  } catch (error) {
    const message = getErrorMessage(error as Error)
    return Promise.resolve({
      data: null,
      error: {
        message,
        isNeedConfirmEmail: message === "NEED_CONFIRM_EMAIL",
      },
    })
  }
}
