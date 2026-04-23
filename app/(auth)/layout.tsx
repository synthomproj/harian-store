import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_22%),radial-gradient(circle_at_85%_15%,_rgba(59,130,246,0.16),_transparent_20%),linear-gradient(180deg,_#020617_0%,_#081121_45%,_#0b1326_100%)] text-white">
      {children}
    </div>
  );
}
