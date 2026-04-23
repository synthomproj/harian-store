import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewOrderPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Buat pesanan baru</CardTitle>
        <CardDescription>
          Route ini dipersiapkan untuk form pilih paket, agenda, tanggal, jam, dan durasi meeting.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-slate-600">
        Langkah berikutnya adalah menambahkan server action untuk membuat `orders` dan `meeting_requests`.
      </CardContent>
    </Card>
  );
}
