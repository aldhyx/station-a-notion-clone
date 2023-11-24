"use client"

import { useSelectedLayoutSegments } from "next/navigation"

export default function SettingsHeader() {
  const segments = useSelectedLayoutSegments()
  const lastSegment = segments.pop()?.toLocaleLowerCase() as keyof typeof title

  const title = {
    settings: "Settings",
    "change-password": "Change password",
  }

  return (
    <div className="flex w-full items-center justify-between ">
      <p className="max-w-[130px] text-sm md:max-w-[240px]">{title[lastSegment]}</p>
    </div>
  )
}
