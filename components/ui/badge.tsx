import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border-2 border-black px-3 py-1 text-xs font-semibold transition-colors shadow-[2px_2px_0_0_#000]",
  {
    variants: {
      variant: {
        default: "bg-yellow-300 text-black",
        secondary: "bg-cyan-300 text-black",
        outline: "bg-white text-black",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
