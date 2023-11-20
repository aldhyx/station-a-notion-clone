import Image from "next/image"
import { Button } from "./ui/button"

export function GoogleButton() {
  return (
    <Button className="mb-3 w-full" size="lg" variant="outline">
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
    <Button className="w-full" size="lg" variant="outline">
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
