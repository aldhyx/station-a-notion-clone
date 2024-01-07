import { Button } from "@/components/ui/button"
import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"

type Props = {
  email: string | null
}

export default function HeroesAuth({ email }: Props) {
  if (!email) {
    return (
      <Button size="lg" asChild>
        <Link href="/signup">Get Station Free</Link>
      </Button>
    )
  }

  return (
    <Button size="lg" asChild>
      <Link href="/doc">
        View dashboard
        <ArrowRightIcon className="ml-2 h-4 w-4" />
      </Link>
    </Button>
  )
}
