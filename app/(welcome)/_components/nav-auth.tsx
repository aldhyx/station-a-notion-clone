import UserPopover from "@/app/(main)/_components/popover/user-popover"
import { Button } from "@/components/ui/button"
import { GithubIcon } from "lucide-react"
import Link from "next/link"

type Props = {
  fullname: string | null
  username: string | null
  email: string | null
}

export default function NavAuth({ fullname, username, email }: Props) {
  if (!email) {
    return (
      <div className="flex gap-x-1">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/login">Log in</Link>
        </Button>

        <Button size="sm" asChild>
          <Link href="/signup">Sign up</Link>
        </Button>

        <Button asChild variant="ghost" size="sm">
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/fsaythanry/station-a-notion-clone"
          >
            <GithubIcon size={16} />
          </a>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex gap-x-1">
      <UserPopover fullname={fullname} username={username}>
        <Button variant="ghost" size="sm" className="max-w-[200px] items-center">
          <span className="truncate">{email}</span>
        </Button>
      </UserPopover>

      <Button asChild variant="ghost" size="sm">
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/fsaythanry/station-a-notion-clone"
        >
          <GithubIcon size={16} />
        </a>
      </Button>
    </div>
  )
}
