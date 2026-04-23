import type { ReactNode } from "react";
import { DashboardShell } from "@/components/app/dashboard-shell";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/webhooks", label: "Webhooks" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <DashboardShell
      title="Admin Panel"
      description="Area internal untuk verifikasi pembayaran, provisioning Zoom, dan pengelolaan produk."
      badge="Admin Panel"
      links={links}
    >
      {children}
    </DashboardShell>
  );
}
