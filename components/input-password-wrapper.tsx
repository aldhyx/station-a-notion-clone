"use client"

import { cn } from "@/lib/utils"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import React, { useState } from "react"
import { type FieldError } from "react-hook-form"

export default function InputPasswordWrapper({
  error,
  render,
  peerClassName,
}: {
  error?: FieldError
  render: ({ showPassword }: { showPassword: boolean }) => React.ReactNode
  peerClassName: string
}) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div
      className={cn(
        "box-content flex h-10 items-center rounded-sm border border-zinc-200",
        error && "border-red-600",
      )}
    >
      {render({ showPassword })}

      <div
        role="button"
        className={`grid h-10 cursor-pointer items-center rounded-r-sm bg-zinc-100 px-3 peer-focus/${peerClassName}:bg-zinc-50`}
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
