import Logo from "@/components/logo"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function WelcomePage() {
  return (
    <div className="mx-auto flex min-h-screen flex-col justify-between text-zinc-900">
      {/* navbar */}
      <nav className={"flex w-full items-center justify-between bg-background p-5"}>
        <Logo />

        <div className="flex gap-x-2">
          <Button variant="zinc-ghost" size="sm" asChild>
            <Link href="/login">Log In</Link>
          </Button>

          <Button className="hidden md:flex" size="sm" asChild variant="zinc">
            <Link href="/signup">Get Station Free</Link>
          </Button>
        </div>
      </nav>
      {/* end navbar */}

      {/* heroes */}
      <main className="w-100 flex flex-col items-center justify-center">
        <div className="max-w-4xl pt-24 text-center">
          <h1 className="mb-3 text-3xl font-bold md:mb-5 md:text-6xl">
            Your💡<span className="underline">ideas</span>, 📚{" "}
            <span className="underline">docs</span>, <br /> & 🎯{" "}
            <span className="underline">projects</span>. Together.
          </h1>

          <p className="mb-3 font-medium md:text-2xl">
            Station is the connected workspace where <br /> better, faster work happens.
          </p>

          <Button className="text-base" asChild variant="zinc">
            <Link href="/signup">Get Station Free</Link>
          </Button>
        </div>

        <div className="relative h-[300px] w-[300px] md:h-[600px] md:w-[800px]">
          <Image src="/assets/heroes.png" alt="heroes" fill className="object-contain" />
        </div>
      </main>
      {/* end heroes */}

      {/* footer */}
      <footer className="mx-auto flex w-full flex-col items-center justify-between p-6 md:flex-row md:items-start">
        <div className="hidden md:block">
          <Logo />
        </div>

        <div>
          <div className="mb-2 flex justify-center gap-x-4">
            <Button
              className="h-min p-0 text-xs font-semibold text-zinc-700 md:text-sm"
              size="sm"
              variant="link"
            >
              Privacy Policy
            </Button>

            <Button
              className="h-min p-0 text-xs font-semibold text-zinc-700 md:text-sm"
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
      {/* end footer */}
    </div>
  )
}
