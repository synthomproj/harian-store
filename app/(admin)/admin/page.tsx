import { RouteCard } from "@/components/app/route-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <>
      <section className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Order Masuk</CardTitle>
            <CardDescription>Antrian order yang masih aktif.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">Belum terhubung ke Supabase.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Review Payment</CardTitle>
            <CardDescription>Submission transfer yang perlu diverifikasi.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">Menunggu implementasi table payments.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Provisioning Gagal</CardTitle>
            <CardDescription>Failure yang butuh retry atau investigasi.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">Akan membaca `webhook_logs` dan `zoom_meetings`.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Paket Aktif</CardTitle>
            <CardDescription>Jumlah produk meeting yang sedang dijual.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">Akan membaca `products`.</CardContent>
        </Card>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <RouteCard href="/admin/orders" title="Kelola Orders" description="Monitor order pelanggan dan status prosesnya." />
        <RouteCard href="/admin/payments" title="Review Payments" description="Approve atau reject bukti pembayaran manual." />
        <RouteCard href="/admin/products" title="Kelola Produk" description="Tambah dan edit paket meeting yang dijual." />
      </section>
    </>
  );
}
