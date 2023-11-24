"use client"

import SignOutDialog from "@/components/dialogs/sign-out-dialog"
import { Button } from "@/components/ui/button"
import { ChevronRightIcon, EditIcon, UserCircle2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Settings() {
  return (
    <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-y-8 px-4">
      <section className="">
        <Button
          size="lg"
          className="flex h-auto w-full items-center justify-between px-0 hover:bg-zinc-50"
          variant="ghost"
        >
          <div className="flex items-center">
            <div className="relative mr-3 h-[60px] w-[60px]">
              <Image
                src="/assets/profile.jpg"
                alt="user profile"
                fill
                className="hidden rounded-full object-cover"
              />
              <UserCircle2 className=" h-[60px] w-[60px]" />
            </div>
            <div className="flex flex-col items-start ">
              <span className="mb-0">unknown name</span>
              <span className="block text-left text-xs font-normal text-zinc-500">
                @unknown
              </span>
            </div>
          </div>
          <EditIcon className="h-4 w-4" />
        </Button>
      </section>

      <section className="">
        <h2 className="mb-2 border-b border-zinc-200 pb-2 text-xs font-medium text-zinc-700">
          My setting
        </h2>

        <Button
          size="lg"
          className="flex h-16 w-full flex-col items-start px-0 hover:bg-zinc-50"
          variant="ghost"
        >
          <div className="mb-1 flex w-full justify-between align-baseline">
            <span>Appearance</span>
            <EditIcon className="h-4 w-4" />
          </div>
          <span className="block text-left text-xs font-normal text-zinc-500">
            Customize how Station looks on your devices
          </span>
        </Button>
      </section>

      <section className="">
        <h2 className="mb-2 border-b border-zinc-200 pb-2 text-xs font-medium text-zinc-700">
          Accounts security
        </h2>

        <Button
          size="lg"
          className="flex h-16 w-full flex-col items-start px-0 hover:bg-zinc-50"
          variant="ghost"
        >
          <div className="mb-1 flex w-full justify-between align-baseline">
            <span>Email</span>
            <EditIcon className="h-4 w-4" />
          </div>
          <span className="block text-left text-xs font-normal text-zinc-500">
            unknown@mail.com
          </span>
        </Button>

        <Button
          size="lg"
          className="flex h-16 w-full flex-col items-start px-0 hover:bg-zinc-50"
          variant="ghost"
          asChild
        >
          <Link href="/settings/change-password">
            <div className="mb-1 flex w-full justify-between align-baseline">
              <span>Password</span>
              <EditIcon className="h-4 w-4" />
            </div>
            <span className="block text-left text-xs font-normal text-zinc-500">
              Set a permanent password to login to your account.
            </span>
          </Link>
        </Button>
      </section>

      <section className="">
        <h2 className="mb-2 border-b border-zinc-200 pb-2 text-xs font-medium text-zinc-700">
          Support
        </h2>

        <SignOutDialog scope="others">
          <Button
            size="lg"
            className="flex h-16 w-full flex-col items-start px-0 hover:bg-zinc-50"
            variant="ghost"
          >
            <div className="mb-1 flex w-full justify-between align-baseline">
              <span>Log out from other devices</span>
              <ChevronRightIcon className="h-4 w-4" />
            </div>
            <span className="block max-w-[80%] text-left text-xs font-normal text-zinc-500">
              Log out of all other active sessions on other devices besides this one
            </span>
          </Button>
        </SignOutDialog>

        <Button
          size="lg"
          className="flex h-16 w-full flex-col items-start px-0 hover:bg-zinc-50"
          variant="ghost"
        >
          <div className="mb-1 flex w-full justify-between align-baseline">
            <span className="text-red-600">Delete my account</span>
            <ChevronRightIcon className="h-4 w-4" />
          </div>
          <span className="block text-left text-xs font-normal text-zinc-500">
            Permanently delete the account
          </span>
        </Button>
      </section>
    </div>
  )
}
