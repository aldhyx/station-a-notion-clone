import Logo from "@/components/logo"
import Link from "next/link"
import React from "react"

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="text-zinc-900">
      <header className="flex w-full items-center justify-start bg-zinc-50 p-5">
        <Logo />
      </header>

      <main className="mx-auto flex w-full max-w-sm flex-col items-center pt-24">
        {children}
      </main>

      <footer className="mx-auto max-w-xl p-8 pt-20">
        <p className="text-center text-xs text-zinc-500">
          By clicking &quot;Continue with Google/Facebook/Email&quot; above, you
          acknowledge that you have read and understood, and agree to Station&apos;s{" "}
          <Link href="#" className="underline">
            Terms & Conditions
          </Link>{" "}
          and{" "}
          <Link href="#" className="underline">
            Privacy Policy
          </Link>
          .
        </p>
      </footer>
    </div>
  )
}

export default AuthLayout
