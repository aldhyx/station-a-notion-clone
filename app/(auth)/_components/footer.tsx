"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Footer() {
  const pathname = usePathname()
  console.log(pathname)
  const showAgreement =
    !pathname.startsWith("/signup-verification") &&
    !pathname.startsWith("/forgot-password")

  return (
    <footer className="mx-auto max-w-xl p-8 pt-20">
      {showAgreement && (
        <p className="text-center text-xs text-zinc-500">
          By clicking &quot;Continue with Google/Facebook/Email & Password&quot; above,
          you acknowledge that you have read and understood, and agree to Station&apos;s{" "}
          <Link href="#" className="underline">
            Terms & Conditions
          </Link>{" "}
          and{" "}
          <Link href="#" className="underline">
            Privacy Policy
          </Link>
          .
        </p>
      )}
    </footer>
  )
}
