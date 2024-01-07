"use client"

import { cn } from "@/lib/utils"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import React, { useState } from "react"
import { type FieldError } from "react-hook-form"
import { Button } from "./ui/button"

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
        "box-content flex h-10 items-center rounded-md border border-zinc-200 ",
        error && "border-red-600",
      )}
    >
      {render({ showPassword })}

      <Button
        type="button"
        variant="ghost"
        className={`grid h-10 cursor-pointer items-center rounded-l-none bg-zinc-50 px-3 text-zinc-800 transition-none peer-focus:bg-background `}
        onClick={() => setShowPassword(prev => !prev)}
      >
        {!showPassword ? (
          <EyeIcon className="h-4 w-4" />
        ) : (
          <EyeOffIcon className="h-4 w-4" />
        )}
      </Button>
    </div>
  )
}
