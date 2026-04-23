import type { ReactNode } from "react";
import { SiteFooter } from "@/components/app/site-footer";
import { SiteHeader } from "@/components/app/site-header";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
