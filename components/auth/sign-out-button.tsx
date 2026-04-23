import { LogOut } from "lucide-react";
import { signOutAction } from "@/app/(auth)/sign-out-action";
import { Button } from "@/components/ui/button";

type SignOutButtonProps = {
  variant?: "default" | "outline" | "ghost" | "secondary";
  className?: string;
};

export function SignOutButton({ variant = "outline", className }: SignOutButtonProps) {
  return (
    <form action={signOutAction}>
      <Button type="submit" variant={variant} className={className}>
        <LogOut className="size-4" />
        Sign out
      </Button>
    </form>
  );
}
