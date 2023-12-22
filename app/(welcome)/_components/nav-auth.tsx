import UserPopover from "@/app/(main)/_components/popovers/user-popover"
import { Button } from "@/components/ui/button"
import { UserCircle } from "lucide-react"
import Link from "next/link"

type Props = {
  fullname: string | null
  username: string | null
  email: string | null
}

export default function NavAuth({ fullname, username, email }: Props) {
  if (!email) {
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
      <UserPopover fullname={fullname} username={username}>
        <Button variant="ghost" size="sm" className="max-w-[200px] items-center">
          <UserCircle className="mr-2 h-4 w-4 shrink-0" />
          <span className="truncate">{email}</span>
        </Button>
      </UserPopover>
    </div>
  )
}
