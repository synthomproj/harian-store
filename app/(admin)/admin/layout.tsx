import type { ReactNode } from "react";
import { DashboardShell } from "@/components/app/dashboard-shell";
import { requireAdmin } from "@/lib/auth";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/webhooks", label: "Webhooks" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireAdmin();

  return (
    <DashboardShell
      title="Admin Panel"
      description="Area internal untuk verifikasi pembayaran, provisioning Zoom, dan pengelolaan produk."
      badge="Admin Panel"
      links={links}
      userLabel={user.email ?? "Admin"}
    >
      {children}
    </DashboardShell>
  );
}
