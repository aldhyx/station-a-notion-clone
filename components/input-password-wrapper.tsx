"use client"

import { cn } from "@/lib/utils"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import React, { useState } from "react"
import { type FieldError } from "react-hook-form"

export default function InputPasswordWrapper({
  error,
  render,
}: {
  error?: FieldError
  render: ({ showPassword }: { showPassword: boolean }) => React.ReactNode
}) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div
      className={cn(
        "box-content flex h-10 items-center rounded-sm border border-zinc-200 dark:border-zinc-600",
        error && "border-red-600",
      )}
    >
      {render({ showPassword })}

      <div
        role="button"
        className={`grid h-10 cursor-pointer items-center rounded-r-sm bg-zinc-50 px-3 peer-focus:bg-background dark:bg-zinc-700 dark:text-zinc-100`}
        onClick={() => setShowPassword(prev => !prev)}
      >
        {!showPassword ? (
          <EyeIcon className="h-4 w-4" />
        ) : (
          <EyeOffIcon className="h-4 w-4" />
        )}
      </div>
    </div>
  )
}
