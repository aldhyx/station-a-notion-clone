import { getErrorMessage } from "@/helper/error.helper"
import { client } from "@/lib/supabase/client"
import { type Provider } from "@supabase/supabase-js"
import { create } from "zustand"

type AuthAction = {
  resetPasswordAsync(email: string): Promise<{ error: string } | void>
  resetPasswordVerifyAsync(
    token: string,
    email: string,
  ): Promise<{ error: string } | void>
  loginAsync(opt: {
    email: string
    password: string
  }): Promise<{ error: string; isNeedConfirmEmail: boolean } | void>
  signUpAsync(opt: { email: string; password: string }): Promise<{ error: string } | void>
  signUpWithOauth(opt: { provider: Provider }): Promise<{ error: string } | void>
  signUpVerifyAsync(opt: {
    email: string
    token: string
  }): Promise<{ error: string } | void>
  resendOtpAsync(opt: { email: string }): Promise<{ error: string } | void>
}

export const useAuthStore = create<AuthAction>()(() => ({
  async resetPasswordAsync(email) {
    try {
      const { error, data } = await client.auth.resetPasswordForEmail(email)

      if (error) throw new Error(error.message)
    } catch (error) {
      return { error: getErrorMessage(error as Error) }
    }
  },
  async resetPasswordVerifyAsync(token, email) {
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
    } catch (error) {
      return { error: getErrorMessage(error as Error) }
    }
  },
  async loginAsync(opt) {
    try {
      const { data, error } = await client.auth.signInWithPassword(opt)
      if (!error) return

      const isNeedConfirmEmail = error.message.toLowerCase() === "email not confirmed"

      throw new Error(
        isNeedConfirmEmail
          ? "NEED_CONFIRM_EMAIL"
          : error.status === 400
          ? "Invalid email or password"
          : error.message,
      )
    } catch (error) {
      const message = getErrorMessage(error as Error)

      return {
        error: message,
        isNeedConfirmEmail: message === "NEED_CONFIRM_EMAIL",
      }
    }
  },
  async signUpAsync(opt) {
    try {
      const { data, error } = await client.auth.signUp(opt)
      if (!error) {
        // Currently the response of signUp returns a fake user object instead of an error.
        // For now we check the identities object which would be empty if a user already exits.
        const isEmailTaken = data.user?.identities?.length === 0
        if (isEmailTaken) throw new Error("Email already in use")
      } else {
        // rate limit error
        if (error.status === 429) throw new Error("")
        throw new Error(error.message)
      }
    } catch (error) {
      return { error: getErrorMessage(error as Error) }
    }
  },
  async signUpWithOauth(opt) {
    try {
      const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/oauth/callback`

      if (!redirectTo) throw new Error("Undefined callback url!")

      const { data, error } = await client.auth.signInWithOAuth({
        provider: opt.provider,
        options: { redirectTo },
      })

      if (error) throw new Error(error.message)
    } catch (error) {
      return { error: getErrorMessage(error as Error) }
    }
  },
  async signUpVerifyAsync(opt) {
    try {
      const { data, error } = await client.auth.verifyOtp({ ...opt, type: "email" })
      if (!error) return

      // rate limit error
      if (error.status === 429) throw new Error("")
      throw new Error(error.message)
    } catch (error) {
      return { error: getErrorMessage(error as Error) }
    }
  },
  async resendOtpAsync(opt) {
    try {
      const { error, data } = await client.auth.resend({ type: "signup", ...opt })

      if (error) {
        // rate limit error
        if (error.status === 429) throw new Error("")
        throw new Error(error.message)
      }
    } catch (error) {
      return { error: getErrorMessage(error as Error) }
    }
  },
}))
