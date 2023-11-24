"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase/client"
import { ChevronRightIcon, EditIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import React, { useState } from "react"
import { toast } from "sonner"

export default function SettingDialog({ children }: { children: React.ReactNode }) {
  const [loggingOut, setLoggingOut] = useState(false)
  const signOutHandler = () => {
    setLoggingOut(true)
    const promise = supabase.auth.signOut({ scope: "others" })

    toast.promise(promise, {
      loading: "Logging out other devices...",
      success: data => {
        setLoggingOut(false)
        if (data.error) return "Something went wrong! Log out other devices failed."
        return "Log out other devices success."
      },
      error: () => {
        setLoggingOut(false)
        return "Something went wrong! Log out other devices failed."
      },
      dismissible: false,
    })
  }

  return (
    <Dialog modal>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="top-[10%] w-[90%] translate-y-[0] gap-y-6 overflow-hidden rounded-sm bg-zinc-50 px-5 py-5 pb-2 md:max-w-3xl">
        <DialogHeader className="mb-1 text-left font-medium">Settings</DialogHeader>
        <section className="mb-3">
          <Button
            size="lg"
            className="flex h-auto w-full items-center justify-between px-0 hover:bg-zinc-50"
            variant="ghost"
          >
            <div className="flex items-center">
              <div className="relative mr-2 h-[40px] w-[40px]">
                <Image
                  src="/assets/profile.jpg"
                  alt="user profile"
                  fill
                  className="rounded-full object-cover"
                />
                {/* <UserCircle2 className=" h-[20px] w-[20px]" /> */}
              </div>
              <div className="flex flex-col items-start ">
                <span className="mb-0">unknown name</span>
                <span className="block text-left text-xs font-normal text-zinc-500">
                  @unknown
                </span>
              </div>
            </div>
            <EditIcon className="mb-auto h-4 w-4" />
          </Button>
        </section>

        <section className="">
          <h2 className="mb-2 border-b border-zinc-200 pb-2 text-xs font-medium text-zinc-700">
            My settings
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
            Accounts Security
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
            <Link href="/reset-password">
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

          <Button
            size="lg"
            className="flex h-16 w-full flex-col items-start px-0 hover:bg-zinc-50"
            variant="ghost"
            onClick={signOutHandler}
            disabled={loggingOut}
          >
            <div className="mb-1 flex w-full justify-between align-baseline">
              <span>Log out from other devices</span>
              <ChevronRightIcon className="h-4 w-4" />
            </div>
            <span className="block max-w-[80%] text-left text-xs font-normal text-zinc-500">
              Log out of all other active sessions on other devices besides this one
            </span>
          </Button>

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
      </DialogContent>
    </Dialog>
  )
}
