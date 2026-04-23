"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

type AuthSubmitButtonProps = {
  idleLabel: string;
  pendingLabel: string;
};

export function AuthSubmitButton({ idleLabel, pendingLabel }: AuthSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full bg-[#00d1ff] text-slate-950 hover:bg-[#7cecff]" disabled={pending}>
      {pending ? pendingLabel : idleLabel}
    </Button>
  );
}
