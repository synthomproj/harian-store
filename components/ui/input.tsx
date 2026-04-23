import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
        <input
          type={type}
          className={cn(
          "flex h-10 w-full rounded-[0.75rem] border-2 border-black bg-white px-3 py-2 text-base text-black shadow-[4px_4px_0_0_#000] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
