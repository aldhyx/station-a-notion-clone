import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function LoginPage() {
  return (
    <>
      <h1 className="mb-8 font-bold md:text-5xl">Log in</h1>

      <Button className="mb-3 w-full" size="sm" variant="outline">
        <Image
          src="/assets/google.svg"
          alt="google"
          width={16}
          height={16}
          className="mr-2 object-contain"
        />
        Continue with Google
      </Button>

      <Button className="w-full" size="sm" variant="outline">
        <Image
          src="/assets/facebook.svg"
          alt="facebook"
          width={16}
          height={16}
          className="mr-2 object-contain"
        />
        Continue with Facebook
      </Button>
    </>
  )
}
