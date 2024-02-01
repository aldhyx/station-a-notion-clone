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
    <div className="mx-auto flex min-h-screen flex-col justify-between text-primary">
      <nav className={"flex w-full items-center justify-between bg-background p-5"}>
        <Logo />

        <NavAuth
          email={data.user?.email ?? null}
          fullname={profile.fullname}
          username={profile.username}
        />
      </nav>

      <main className="w-100 flex flex-col items-center justify-center">
        <div className="mb-16 max-w-4xl text-center">
          <h1 className="mb-3 text-3xl font-bold md:mb-5 md:text-6xl">
            Your💡
            <span className="bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500 bg-clip-text text-transparent underline">
              ideas
            </span>
            , 📚{" "}
            <span className="bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-500 bg-clip-text text-transparent underline ">
              docs
            </span>
            , <br /> & 🎯{" "}
            <span className="bg-gradient-to-r from-rose-500 via-orange-600 to-red-500 bg-clip-text text-transparent underline ">
              projects
            </span>
            . Together.
          </h1>

          <p className="mb-3 font-medium md:text-2xl">
            Station is the connected workspace where <br /> better, faster work happens.
          </p>

          <HeroesAuth email={data.user?.email ?? null} />
        </div>

        <div className="relative mx-auto flex w-full max-w-3xl items-center justify-center overflow-hidden pl-5">
          <Image
            src="/assets/documents.png"
            alt="heroes"
            width={360}
            height={360}
            className="w-[180px] object-contain md:w-[360px] "
          />
          <Image
            src="/assets/reading.png"
            alt="heroes"
            width={360}
            height={360}
            className="w-[180px] object-contain md:w-[360px] "
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
              className="h-min p-0 text-xs font-medium md:text-sm"
              size="sm"
              variant="link"
            >
              Privacy Policy
            </Button>

            <Button
              className="h-min p-0 text-xs font-medium md:text-sm"
              size="sm"
              variant="link"
            >
              Terms & Conditions
            </Button>
          </div>

          <p className="text-right text-xs text-muted-foreground">
            © {new Date().getFullYear()} Station Labs - All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
