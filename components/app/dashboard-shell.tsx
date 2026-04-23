"use client";

import Link from "next/link";
import { ChevronRight, LayoutGrid, PanelLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Button } from "@/components/ui/button";

type DashboardShellProps = {
  title: string;
  description: string;
  badge: string;
  links: Array<{ href: string; label: string }>;
  userLabel?: string;
  children: React.ReactNode;
};

export function DashboardShell({
  title,
  description,
  badge,
  links,
  userLabel,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-slate-200 bg-white lg:block">
          <div className="flex h-full flex-col">
            <div className="border-b border-slate-200 px-6 py-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-slate-950 p-2 text-white">
                  <LayoutGrid className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-tight text-slate-950">Harian Store</p>
                  <p className="text-xs text-slate-500">Dashboard</p>
                </div>
              </div>
            </div>

            <nav className="flex-1 space-y-2 px-4 py-6">
              {links.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

                return (
                  <Button
                    key={link.href}
                    asChild
                    variant="ghost"
                    className={
                      isActive
                        ? "w-full justify-start rounded-lg bg-slate-950 text-white hover:bg-slate-900 hover:text-white"
                        : "w-full justify-start text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                    }
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </Button>
                );
              })}
            </nav>
          </div>
        </aside>

        <div className="min-w-0 bg-slate-100 text-slate-950">
          <header className="border-b border-slate-200 bg-white">
            <div className="flex items-center justify-between gap-4 px-6 py-4 lg:px-8">
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-slate-200 bg-slate-100 p-2 text-slate-700 lg:hidden">
                  <PanelLeft className="size-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>{badge}</span>
                    <ChevronRight className="size-4" />
                    <span className="text-slate-950">{title}</span>
                  </div>
                  <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">{title}</h2>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {userLabel ? <span className="hidden text-sm text-slate-500 md:inline">{userLabel}</span> : null}
                <SignOutButton className="border-slate-200 bg-white text-slate-900 hover:bg-slate-100" />
              </div>
            </div>
          </header>

          <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:px-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm leading-6 text-slate-600">{description}</p>
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
