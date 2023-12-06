import { getErrorMessage } from "@/helper/error.helper"
import { client } from "@/lib/supabase/client"

type Props = {
  email: string
  password: string
}

export const signUpWithPasswordCredentials = async (props: Props) => {
  try {
    const { data, error } = await client.auth.signUp(props)

    if (!error) {
      // Currently the response of signUp returns a fake user object instead of an error.
      // For now we check the identities object which would be empty if a user already exits.
      const isEmailTaken = data.user?.identities?.length === 0
      if (isEmailTaken) throw new Error("Email already in use")
      return { data, error: null }
    }

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
