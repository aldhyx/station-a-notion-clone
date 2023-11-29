import Logo from "@/components/logo"
import React from "react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-zinc-800">
      <header className="flex w-full items-center justify-start bg-zinc-50 p-5">
        <Logo />
      </header>

      <main className="mx-auto flex w-full flex-col items-center px-4 pt-24 md:max-w-lg">
        {children}
      </main>
    </div>
  )
}
