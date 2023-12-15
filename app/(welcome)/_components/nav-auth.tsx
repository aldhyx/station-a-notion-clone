import UserPopover from "@/app/(main)/_components/popovers/user-popover"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { LoaderIcon, UserCircle } from "lucide-react"
import { cookies } from "next/headers"
import Link from "next/link"

export default async function NavAuth() {
  const cookiesStore = cookies()
  const server = createClient(cookiesStore)
  const {
    data: { user },
  } = await server.auth.getUser()
  const { data } = await server.from("profiles").select(`username, fullname`).single()

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
      <UserPopover
        email={user.email!}
        fullname={data?.fullname ?? null}
        username={data?.username ?? null}
      >
        <Button variant="ghost" size="sm" className="max-w-[200px] items-center">
          <UserCircle className="mr-2 h-4 w-4 shrink-0" />
          <span className="truncate">{user.email}</span>
        </Button>
      </UserPopover>
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
