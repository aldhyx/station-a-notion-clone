"use client"

import ChangeEmailDialog from "@/components/dialogs/change-email/dialog"
import ChangePasswordDialog from "@/components/dialogs/change-password-dialog"
import ChangeProfileDialog from "@/components/dialogs/change-profile-dialog"
import SignOutDialog from "@/components/dialogs/sign-out-dialog"
import ModeToggle from "@/components/mode-toogle"
import { Button } from "@/components/ui/button"
import { useUserStore } from "@/hooks/use-user-store"
import { ChevronRightIcon, EditIcon, UserCircle2 } from "lucide-react"
import Image from "next/image"

export default function SettingsPage() {
  const { currentUser, fullname, username } = useUserStore()

  return (
    <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-y-8 px-4">
      <ChangeProfileDialog>
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

            {fullname && username && (
              <div className="flex flex-col items-start ">
                <span className="mb-0 capitalize">{fullname}</span>
                <span className="block text-left text-xs font-normal text-zinc-500">
                  @{username}
                </span>
              </div>
            )}
          </div>
          <EditIcon className="h-4 w-4" />
        </Button>
      </ChangeProfileDialog>

      <section>
        <h2 className="mb-2 border-b border-zinc-200 pb-2 text-xs font-medium text-zinc-700">
          My setting
        </h2>
        <Button
          size="lg"
          className="flex h-16 w-full items-center px-0 hover:bg-zinc-50"
          variant="ghost"
        >
          <div className="flex w-full flex-col items-start">
            <span className="mb-1 ">Appearance</span>

            <span className="block text-left text-xs font-normal text-zinc-500">
              Customize how Station looks on your devices
            </span>
          </div>
          <ModeToggle />
        </Button>
      </section>

      <section>
        <h2 className="mb-2 border-b border-zinc-200 pb-2 text-xs font-medium text-zinc-700">
          Accounts security
        </h2>

        <ChangeEmailDialog>
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
              {currentUser?.email}
            </span>
          </Button>
        </ChangeEmailDialog>
        <ChangePasswordDialog>
          <Button
            size="lg"
            className="flex h-16 w-full flex-col items-start px-0 hover:bg-zinc-50"
            variant="ghost"
          >
            <div className="mb-1 flex w-full justify-between align-baseline">
              <span>Password</span>
              <EditIcon className="h-4 w-4" />
            </div>
            <span className="block text-left text-xs font-normal text-zinc-500">
              Set a permanent password to login to your account.
            </span>
          </Button>
        </ChangePasswordDialog>
      </section>

      <section>
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
