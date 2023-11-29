import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/server"
import { LoaderIcon } from "lucide-react"
import Link from "next/link"

export default async function NavAuth() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="flex gap-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/login">Log In</Link>
        </Button>

        <Button className="hidden md:flex" size="sm" asChild>
          <Link href="/signup">Get Station Free</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <Button className="md:flex" size="sm" asChild>
        <Link href="/pages">Dashboard</Link>
      </Button>
    </div>
  )
}

NavAuth.Loading = function Loading() {
  return (
    <div className="flex h-9 items-center">
      <LoaderIcon className="h-6 w-6 animate-spin" />
    </div>
  )
}
