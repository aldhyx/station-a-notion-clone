import { Button } from "@/components/ui/button"
import { client } from "@/lib/supabase/client"
import { toastError } from "@/lib/toast"
import Image from "next/image"

export function GoogleButton() {
  const googleHandler = async () => {
    try {
      const { error } = await client.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/v1/oauth/callback`,
        },
      })

      if (error) throw new Error(error.message)
    } catch (error) {
      toastError({ message: "Failed to login or sign up with google." })
    }
  }

  return (
    <Button className="mb-3 w-full" size="lg" variant="outline" onClick={googleHandler}>
      <Image
        src="/assets/google.svg"
        alt="google"
        width={16}
        height={16}
        className="mr-2 object-contain"
      />
      Continue with Google
    </Button>
  )
}

export function FacebookButton() {
  return (
    <Button
      className="w-full"
      size="lg"
      variant="outline"
      onClick={() => alert("Not ready, please continue with others")}
    >
      <Image
        src="/assets/facebook.svg"
        alt="facebook"
        width={16}
        height={16}
        className="mr-2 object-contain"
      />
      Continue with Facebook
    </Button>
  )
}
