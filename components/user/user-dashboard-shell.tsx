"use client";

import Link from "next/link";
import { CreditCard, Home, LogOut, Menu, Package, ShoppingBag, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/app/(auth)/sign-out-action";
import { NbButton } from "@/components/neo/nb-button";
import { NbCard } from "@/components/neo/nb-card";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type UserDashboardShellProps = {
  title?: string;
  description?: string;
  userLabel?: string;
  children: React.ReactNode;
};

const navItems = [
  { href: "/dashboard", label: "Overview", icon: Home },
  { href: "/dashboard/orders/new", label: "Beli Paket", icon: ShoppingBag },
  { href: "/dashboard/meeting", label: "Meeting", icon: Package },
  { href: "/dashboard/transaksi", label: "Transaksi", icon: CreditCard },
  { href: "/dashboard/profile", label: "Profil", icon: User },
];

export function UserDashboardShell({ children }: UserDashboardShellProps) {
  const pathname = usePathname();

  const navContent = (
    <>
      <NbCard className="bg-cyan-300 p-5">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-black/70">Harian Store</p>
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
    </>
  );

  return (
    <div className="min-h-screen bg-[#f6f3ea] text-black">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-4 lg:grid-cols-[260px_1fr] lg:px-6 lg:py-6">
        <aside className="hidden flex-col gap-4 lg:sticky lg:top-6 lg:flex lg:h-[calc(100vh-3rem)]">
          {navContent}
        </aside>

        <div className="min-w-0 space-y-6">
          <div className="flex items-center justify-between gap-3 lg:hidden">
            <NbCard className="flex-1 bg-cyan-300 px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-black/70">Harian Store</p>
              <p className="mt-1 text-lg font-black leading-none">Customer Panel</p>
            </NbCard>

            <Sheet>
              <SheetTrigger asChild>
                <NbButton variant="neutral" className="shrink-0 bg-white px-4">
                  <Menu className="size-4" />
                  Menu
                </NbButton>
              </SheetTrigger>
              <SheetContent side="left" className="w-[88%] max-w-sm border-r-4 border-black bg-[#f6f3ea] p-4">
                <SheetTitle className="sr-only">Menu dashboard</SheetTitle>
                <div className="mt-8 flex h-full flex-col gap-4">{navContent}</div>
              </SheetContent>
            </Sheet>
          </div>

          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
