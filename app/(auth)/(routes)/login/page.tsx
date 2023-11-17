import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export default function LoginPage() {
  return (
    <>
      <h1 className="mb-8 font-bold md:text-5xl">Log in</h1>
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

      <form
        action="#"
        method="post"
        className="mt-8 flex w-full flex-col gap-y-3 border-t border-zinc-200 pt-8"
      >
        <div className="flex flex-col gap-y-2">
          <Label>Email</Label>
          <Input
            name="email"
            placeholder="Enter your email address..."
            className="h-12 px-4"
          />
        </div>

        <Button size="lg" className="w-full" variant="outline-blue">
          Continue with Email
        </Button>

        <Button
          size="lg"
          variant="link-blue"
          className="font-normal text-zinc-500 underline-offset-2"
        >
          Forgot Password?
        </Button>
      </form>
    </>
  )
}
