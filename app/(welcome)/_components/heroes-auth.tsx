import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/server"
import { LoaderIcon } from "lucide-react"
import Link from "next/link"

export default async function HeroesAuth() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <Button className="text-base" asChild>
        <Link href="/signup">Get Station Free</Link>
      </Button>
    )
  }

  return (
    <Button className="text-base" asChild>
      <Link href="/pages">Dashboard</Link>
    </Button>
  )
}

HeroesAuth.Loading = function Loading() {
  return (
    <div className="flex h-10 w-full items-center justify-center">
      <LoaderIcon className="h-6 w-6 animate-spin" />
    </div>
  )
}
