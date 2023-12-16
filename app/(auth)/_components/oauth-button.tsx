"use client"

import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/use-auth-store"
import Image from "next/image"

export function GoogleButton() {
  const { signUpWithOauth } = useAuthStore()

  return (
    <Button
      className="mb-3 w-full"
      size="lg"
      variant="outline"
      onClick={() => signUpWithOauth({ provider: "google" })}
    >
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
