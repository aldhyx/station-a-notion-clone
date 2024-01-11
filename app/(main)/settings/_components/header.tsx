import { usePathname } from "next/navigation"
import React from "react"

export default function SettingsHeader() {
  const path = usePathname()
  if (path !== "/settings") return null

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <p className="max-w-[130px] text-sm capitalize md:max-w-[240px]">Settings</p>
      </div>
    </>
  )
}
