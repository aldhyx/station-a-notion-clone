import { usePathname } from "next/navigation"
import React from "react"

export default function DocHeader() {
  const path = usePathname()
  if (path !== "/doc") return null

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <p className="max-w-[130px] text-sm capitalize md:max-w-[240px]">
          Getting started
        </p>
      </div>
    </>
  )
}
