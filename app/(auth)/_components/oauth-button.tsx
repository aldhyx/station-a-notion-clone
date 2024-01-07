"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"

type Props = { clickHandler: () => void }

export function GoogleButton({ clickHandler }: Props) {
  return (
    <Button className="w-full" size="lg" variant="outline" onClick={clickHandler}>
      <Image
        src="/assets/google.svg"
        alt=""
        width={16}
        height={16}
        className="mr-2 object-contain"
      />
      Continue with Google
    </Button>
  )
}

export function FacebookButton({ clickHandler }: Props) {
  return (
    <Button className="w-full" size="lg" variant="outline" onClick={clickHandler}>
      <Image
        src="/assets/facebook.svg"
        alt=""
        width={16}
        height={16}
        className="mr-2 object-contain"
      />
      Continue with Facebook
    </Button>
  )
}
