import type { ReactNode } from "react";
import { DashboardShell } from "@/components/app/dashboard-shell";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/profile", label: "Profil" },
  { href: "/dashboard/orders", label: "Pesanan" },
  { href: "/dashboard/orders/new", label: "Buat Pesanan" },
];

export default function UserDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell
      title="User Dashboard"
      description="Area pelanggan untuk mengelola profil, pesanan, pembayaran, dan link meeting."
      badge="User Panel"
      links={links}
    >
      {children}
    </DashboardShell>
  );
}
