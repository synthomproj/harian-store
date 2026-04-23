import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RouteCard } from "@/components/app/route-card";

export default function DashboardPage() {
  return (
    <>
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Profil</CardTitle>
            <CardDescription>Kelengkapan data pelanggan untuk proses order.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">Belum terhubung ke database.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pembayaran</CardTitle>
            <CardDescription>Status bukti transfer dan review admin.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">Menunggu implementasi flow manual payment.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Meeting</CardTitle>
            <CardDescription>Status provisioning dan link Zoom yang sudah jadi.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">Akan membaca data `zoom_meetings`.</CardContent>
        </Card>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <RouteCard href="/dashboard/profile" title="Kelola Profil" description="Lengkapi data pelanggan sebelum checkout." />
        <RouteCard href="/dashboard/orders" title="Riwayat Pesanan" description="Lihat seluruh order dan status terbarunya." />
        <RouteCard href="/dashboard/orders/new" title="Buat Pesanan Baru" description="Mulai flow order meeting dari paket yang dipilih." />
      </section>
    </>
  );
}
