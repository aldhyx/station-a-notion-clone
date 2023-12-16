import * as React from "react"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const inputVariants = cva(
  "flex h-10 w-full rounded-sm border border-zinc-200 bg-zinc-100 px-3 py-2 text-sm text-zinc-800 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus:bg-background focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800/70 dark:focus:bg-zinc-900/50 dark:text-zinc-100 dark:placeholder:text-zinc-600 ",
  {
    variants: {
      inputSize: { default: "h-10", sm: "h-9", lg: "h-11" },
    },
    defaultVariants: {
      inputSize: "default",
    },
  },
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, inputSize, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ inputSize, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"

export { Input }
