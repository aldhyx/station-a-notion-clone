import Logo from "@/components/logo"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import HeroesAuth from "./_components/heroes-auth"
import NavAuth from "./_components/nav-auth"
import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"

type Profile = {
  username: string | null
  fullname: string | null
}

export const revalidate = 0

export default async function WelcomePage() {
  const cookiesStore = cookies()
  const server = createClient(cookiesStore)
  const { data } = await server.auth.getUser()

  const profile: Profile = { fullname: null, username: null }
  if (data.user) {
    const { data } = await server.from("profiles").select(`username, fullname`).single()
    profile.fullname = data?.fullname ?? null
    profile.username = data?.username ?? null
  }

  return (
    <div className="mx-auto flex min-h-screen flex-col justify-between text-zinc-800">
      <nav className={"flex w-full items-center justify-between bg-background p-5"}>
        <Logo />

        <NavAuth
          email={data.user?.email ?? null}
          fullname={profile.fullname}
          username={profile.username}
        />
      </nav>

      <main className="w-100 flex flex-col items-center justify-center">
        <div className="mb-16 max-w-4xl pt-24 text-center">
          <h1 className="mb-3 text-3xl font-bold md:mb-5 md:text-6xl">
            Your💡<span className="underline">ideas</span>, 📚{" "}
            <span className="underline">docs</span>, <br /> & 🎯{" "}
            <span className="underline">projects</span>. Together.
          </h1>

          <p className="mb-3 font-medium text-zinc-700 md:text-2xl">
            Station is the connected workspace where <br /> better, faster work happens.
          </p>

          <HeroesAuth email={data.user?.email ?? null} />
        </div>

        <div className="relative mx-auto flex w-full max-w-3xl items-center justify-center overflow-hidden pl-5">
          <Image
            src="/assets/documents.png"
            alt="heroes"
            width={200}
            height={200}
            className="w-[200px] object-contain md:w-[400px] "
          />
          <Image
            src="/assets/reading.png"
            alt="heroes"
            width={200}
            height={200}
            className="w-[200px] object-contain md:w-[400px] "
          />
        </div>
      </main>

      <footer className="mx-auto flex w-full flex-col items-center justify-between p-6 md:flex-row md:items-start">
        <div className="hidden md:block">
          <Logo />
        </div>

        <div>
          <div className="mb-2 flex justify-center gap-x-4">
            <Button
              className="h-min p-0 text-xs font-medium text-zinc-600 md:text-sm"
              size="sm"
              variant="link"
            >
              Privacy Policy
            </Button>

            <Button
              className="h-min p-0 text-xs font-medium text-zinc-600 md:text-sm"
              size="sm"
              variant="link"
            >
              Terms & Conditions
            </Button>
          </div>

          <p className="text-right text-xs text-zinc-500">
            © {new Date().getFullYear()} Station Labs - All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
