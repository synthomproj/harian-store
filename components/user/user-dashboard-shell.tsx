"use client";

import Link from "next/link";
import { Home, LogOut, Package, PlusSquare, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/app/(auth)/sign-out-action";
import { NbButton } from "@/components/neo/nb-button";
import { NbCard } from "@/components/neo/nb-card";

type UserDashboardShellProps = {
  title: string;
  description: string;
  userLabel?: string;
  children: React.ReactNode;
};

const navItems = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/profile", label: "Profil", icon: User },
  { href: "/dashboard/orders", label: "Pesanan", icon: Package },
  { href: "/dashboard/orders/new", label: "Buat Pesanan", icon: PlusSquare },
];

export function UserDashboardShell({ title, description, userLabel, children }: UserDashboardShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f6f3ea] text-black">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-4 lg:grid-cols-[260px_1fr] lg:px-6 lg:py-6">
        <aside className="flex flex-col gap-4 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
          <NbCard className="bg-cyan-300 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-black/70">Harian Store</p>
            <h1 className="mt-3 text-2xl font-black leading-none">Customer Panel</h1>
            <p className="mt-3 text-sm leading-6 text-black/75">Menu utama untuk cek pesanan, profil, dan link meeting.</p>
          </NbCard>

          <NbCard className="flex-1 p-3">
            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;

                return (
                  <NbButton
                    key={item.href}
                    asChild
                    variant={isActive ? "pink" : "neutral"}
                    className="w-full justify-start"
                  >
                    <Link href={item.href}>
                      <Icon className="size-4" />
                      {item.label}
                    </Link>
                  </NbButton>
                );
              })}
            </nav>
          </NbCard>

          <form action={signOutAction}>
            <NbButton type="submit" variant="default" className="w-full bg-red-300">
              <LogOut className="size-4" />
              Sign out
            </NbButton>
          </form>
        </aside>

        <div className="min-w-0 space-y-6">
          <NbCard className="bg-yellow-200 p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-black/60">Dashboard</p>
                <h2 className="mt-2 text-3xl font-black leading-none">{title}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-black/70">{description}</p>
              </div>
              {userLabel ? (
                <div className="rounded-[0.9rem] border-2 border-black bg-white px-4 py-3 text-sm font-semibold shadow-[4px_4px_0_0_#000]">
                  {userLabel}
                </div>
              ) : null}
            </div>
          </NbCard>

          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
