import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OrdersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar pesanan</CardTitle>
        <CardDescription>Halaman list order milik pelanggan.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-slate-600">
        Nantinya halaman ini membaca tabel `orders` dan `meeting_requests` milik user aktif.
      </CardContent>
    </Card>
  );
}
