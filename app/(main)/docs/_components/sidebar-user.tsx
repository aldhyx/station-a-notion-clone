import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronsUpDownIcon, LogOutIcon, SettingsIcon } from "lucide-react"
import Image from "next/image"

export default function SidebarUser() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="zinc-ghost"
          size="lg"
          className="flex w-full items-center justify-start px-3 font-normal"
        >
          <div className="relative mr-2 h-[20px] w-[20px]">
            <Image
              src="/assets/profile.jpg"
              alt="user profile"
              fill
              className="rounded-sm object-cover"
            />
            {/* <UserCircle2 className=" h-[20px] w-[20px]" /> */}
          </div>

          <p className="mr-1 max-w-[250px] truncate md:max-w-[120px]">
            Frialdhy Saythanry Ketty
          </p>
          <ChevronsUpDownIcon className="h-4 w-4 text-zinc-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        asChild
        className="rounded-sm p-0"
        side="bottom"
        align="start"
        alignOffset={8}
      >
        <div className="w-80">
          <section className="border-b border-zinc-200 p-3">
            <span className="mb-3 block text-xs text-zinc-500">aldyzk@gmail.com</span>
            <div className="flex gap-x-1 px-1">
              <div className="relative mr-2 h-[36px] w-[36px]">
                <Image
                  src="/assets/profile.jpg"
                  alt="user profile"
                  fill
                  className="rounded-sm object-cover"
                />
                {/* <UserCircle2 className=" h-[36px] w-[36px]" /> */}
              </div>

              <div className="flex flex-col">
                <p className="text-sm">Frialdhy Saythanry Ketty&apos;s Station</p>
                <p className="text-xs text-zinc-600">@aldyx</p>
              </div>
            </div>
          </section>

          <section className="w-full bg-zinc-100 p-1">
            <Button
              variant="zinc-ghost"
              className="h-8 w-full justify-start rounded-sm px-2 text-xs font-normal text-zinc-600"
            >
              <SettingsIcon className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button
              variant="zinc-ghost"
              className="h-8 w-full justify-start rounded-sm px-2 text-xs font-normal text-zinc-600"
            >
              <LogOutIcon className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </section>
        </div>
      </PopoverContent>
    </Popover>
  )
}
