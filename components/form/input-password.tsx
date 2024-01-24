import { cn } from "@/lib/utils"
import React, { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { type FieldError } from "react-hook-form"

type Props = {
  /** Comes from FormField render method */
  field: object
  placeholder?: string
  error?: FieldError
}

export default function InputPassword({ placeholder, error, field }: Props) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className={cn("box-content flex h-11 overflow-clip rounded-md")}>
      <Input
        className={cn("peer rounded-r-none border-r-0", error && "border-destructive")}
        placeholder={showPassword ? placeholder || "Enter your password..." : "********"}
        type={showPassword ? "text" : "password"}
        {...field}
      />

      <Button
        type="button"
        variant="link"
        className={cn(
          "w-15 grid h-11 cursor-pointer items-center rounded-l-none border-y border-r bg-secondary",
          "peer-focus-visible:bg-background",
          error && "border-destructive",
        )}
        onClick={() => setShowPassword(prev => !prev)}
      >
        {!showPassword ? <span>Show</span> : <span>Hide</span>}
      </Button>
    </div>
  )
}
