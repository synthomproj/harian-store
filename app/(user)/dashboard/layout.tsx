import type { ReactNode } from "react";
import { requireUser } from "@/lib/auth";
import { UserDashboardShell } from "@/components/user/user-dashboard-shell";

export default async function UserDashboardLayout({ children }: { children: ReactNode }) {
  const user = await requireUser();

  return (
    <UserDashboardShell
      title="User Dashboard"
      description="Area pelanggan untuk mengelola profil, pesanan, pembayaran, dan link meeting."
      userLabel={user.email ?? "User"}
    >
      {children}
    </UserDashboardShell>
  );
}
