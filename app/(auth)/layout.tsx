import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#fff7d6_0%,_#fff7d6_42%,_#00d1ff_42%,_#00d1ff_64%,_#ff8fab_64%,_#ff8fab_100%)] text-slate-950">
      {children}
    </div>
  );
}
