import Logo from "@/components/logo"
import Link from "next/link"
import React from "react"

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <header className="flex w-full items-center justify-start bg-background p-5">
        <Logo />
      </header>

      <main className="mx-auto flex w-full max-w-xs flex-col items-center pt-24">
        {children}
      </main>

      <footer className="mx-auto max-w-lg p-8 pt-20">
        <p className="text-center text-xs text-muted-foreground">
          By clicking &quot;Continue with Google/Facebook&quot; above, you acknowledge
          that you have read and understood, and agree to Station&apos;s{" "}
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
