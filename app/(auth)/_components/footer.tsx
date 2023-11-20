"use client"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Footer() {
  const pathname = usePathname()
  const showAgreement = !pathname.includes("verification")

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

      <p
        className={cn(
          "text-center text-xs text-zinc-500",
          showAgreement ? "pt-24" : "pt-40 md:pt-56",
        )}
      >
        © {new Date().getFullYear()} Station Labs - All rights reserved.
      </p>
    </footer>
  )
}
