import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const nbButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap gap-2 rounded-[0.75rem] border-2 border-black text-sm font-semibold transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-yellow-300 text-black shadow-[4px_4px_0_0_#000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none",
        neutral: "bg-white text-black shadow-[4px_4px_0_0_#000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none",
        pink: "bg-pink-300 text-black shadow-[4px_4px_0_0_#000] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none",
        noShadow: "bg-white text-black",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export function NbButton({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof nbButtonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return <Comp className={cn(nbButtonVariants({ variant, size, className }))} {...props} />;
}
