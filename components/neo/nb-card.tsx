import * as React from "react";
import { cn } from "@/lib/utils";

export function NbCard({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-[1rem] border-2 border-black bg-white text-black shadow-[6px_6px_0_0_#000]",
        className,
      )}
      {...props}
    />
  );
}

export function NbCardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-2 p-6", className)} {...props} />;
}

export function NbCardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("text-lg font-bold leading-none", className)} {...props} />;
}

export function NbCardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("text-sm leading-6 text-black/70", className)} {...props} />;
}

export function NbCardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("px-6 pb-6", className)} {...props} />;
}
