import Logo from "@/components/logo"
import React from "react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-primary">
      <header className="flex w-full items-center justify-start p-5">
        <Logo />
      </header>

      <main className="mx-auto flex w-full flex-col items-center px-4 pt-24 md:max-w-lg">
        {children}
      </main>
    </div>
  )
}
