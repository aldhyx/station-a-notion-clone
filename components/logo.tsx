import Image from "next/image"
import Link from "next/link"

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-x-2">
      <Image
        src="/assets/logo/logo.svg"
        alt="logo"
        height={40}
        width={40}
        className="object-contain"
      />
      <span className="font-semibold">Station</span>
    </Link>
  )
}

export default Logo
